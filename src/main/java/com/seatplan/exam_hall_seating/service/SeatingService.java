package com.seatplan.exam_hall_seating.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.seatplan.exam_hall_seating.entity.ExamSession;
import com.seatplan.exam_hall_seating.entity.Hall;
import com.seatplan.exam_hall_seating.entity.Seat;
import com.seatplan.exam_hall_seating.entity.SeatAllocation;
import com.seatplan.exam_hall_seating.entity.Student;
import com.seatplan.exam_hall_seating.repository.ExamSessionRepository;
import com.seatplan.exam_hall_seating.repository.HallRepository;
import com.seatplan.exam_hall_seating.repository.SeatAllocationRepository;
import com.seatplan.exam_hall_seating.repository.SeatRepository;
import com.seatplan.exam_hall_seating.repository.StudentRepository;

@Service
public class SeatingService {

    private final SeatAllocationRepository seatAllocationRepository;
    private final ExamSessionRepository examSessionRepository;
    private final HallRepository hallRepository;
    private final StudentRepository studentRepository;
    private final SeatRepository seatRepository;

    public SeatingService(
            SeatAllocationRepository seatAllocationRepository,
            ExamSessionRepository examSessionRepository,
            HallRepository hallRepository,
            StudentRepository studentRepository,
            SeatRepository seatRepository) {

        this.seatAllocationRepository = seatAllocationRepository;
        this.examSessionRepository = examSessionRepository;
        this.hallRepository = hallRepository;
        this.studentRepository = studentRepository;
        this.seatRepository = seatRepository;
    }


    // =========================================================
    // NORMAL ALLOCATION CRUD
    // =========================================================

    public SeatAllocation saveAllocation(SeatAllocation allocation) {

        return seatAllocationRepository.save(allocation);
    }


    public List<SeatAllocation> getAllAllocations() {

        return seatAllocationRepository.findAll();
    }


    public SeatAllocation getAllocationById(Long id) {

        return seatAllocationRepository
                .findById(id)
                .orElse(null);
    }


    public void deleteAllocation(Long id) {

        seatAllocationRepository.deleteById(id);
    }


    // =========================================================
    // AUTOMATIC SEATING ARRANGEMENT
    // =========================================================

    public List<SeatAllocation> generateSeating(
            Long examId,
            Long hallId) {


        // -----------------------------------------------------
        // 1. Find Exam
        // -----------------------------------------------------

        ExamSession exam = examSessionRepository
                .findById(examId)
                .orElseThrow(() ->
                        new RuntimeException("Exam not found")
                );


        // -----------------------------------------------------
        // 2. Find Hall
        // -----------------------------------------------------

        Hall hall = hallRepository
                .findById(hallId)
                .orElseThrow(() ->
                        new RuntimeException("Hall not found")
                );


        // -----------------------------------------------------
        // 3. Get all students
        // -----------------------------------------------------

        List<Student> students =
                studentRepository.findAll();


        if (students.isEmpty()) {

            throw new RuntimeException(
                    "No students available"
            );
        }


        // -----------------------------------------------------
        // 4. Get all seats
        // -----------------------------------------------------

        List<Seat> allSeats =
                seatRepository.findAll();


        // -----------------------------------------------------
        // 5. Get only seats belonging to selected hall
        // -----------------------------------------------------

        List<Seat> seats = new ArrayList<>();


        for (Seat seat : allSeats) {

            if (seat.getHall() != null
                    && seat.getHall().getId() != null
                    && seat.getHall().getId().equals(hall.getId())) {

                seats.add(seat);
            }
        }


        // -----------------------------------------------------
        // 6. Sort seats by row and column
        // -----------------------------------------------------

        seats.sort(
                Comparator
                        .comparing(Seat::getRowNumber)
                        .thenComparing(Seat::getColumnNumber)
        );


        // -----------------------------------------------------
        // 7. Check available seats
        // -----------------------------------------------------

        if (seats.isEmpty()) {

            throw new RuntimeException(
                    "No seats available in the selected hall. " +
                    "Please add seats first."
            );
        }


        if (students.size() > seats.size()) {

            throw new RuntimeException(
                    "Not enough seats in the selected hall. " +
                    "Students: " + students.size() +
                    ", Seats: " + seats.size()
            );
        }


        // -----------------------------------------------------
        // 8. Delete old allocations for this exam
        // -----------------------------------------------------

        List<SeatAllocation> oldAllocations =
                seatAllocationRepository.findAll();


        for (SeatAllocation allocation : oldAllocations) {

            if (allocation.getExamSession() != null
                    && allocation.getExamSession().getId() != null
                    && allocation.getExamSession().getId().equals(examId)) {

                seatAllocationRepository.delete(allocation);
            }
        }


        // -----------------------------------------------------
        // 9. Copy students
        // -----------------------------------------------------

        List<Student> remainingStudents =
                new ArrayList<>(students);


        // -----------------------------------------------------
        // 10. Sort students by class/section
        // -----------------------------------------------------

        remainingStudents.sort(
                Comparator.comparing(
                        Student::getClassSection,
                        Comparator.nullsLast(
                                String::compareToIgnoreCase
                        )
                )
        );


        // -----------------------------------------------------
        // 11. Store generated allocations
        // -----------------------------------------------------

        List<SeatAllocation> allocations =
                new ArrayList<>();


        // -----------------------------------------------------
        // 12. Assign students to seats
        // -----------------------------------------------------

        for (Student student : remainingStudents) {

            Seat selectedSeat = null;


            // Try every available seat
            for (Seat seat : seats) {

                // Check whether this seat is already occupied
                if (isSeatAlreadyUsed(
                        seat,
                        allocations)) {

                    continue;
                }


                // Check whether the seat is safe
                if (isSafeSeat(
                        seat,
                        student,
                        allocations)) {

                    selectedSeat = seat;

                    break;
                }
            }


            // -------------------------------------------------
            // If no safe seat was found
            // -------------------------------------------------

            if (selectedSeat == null) {

                throw new RuntimeException(
                        "Unable to generate seating arrangement. " +
                        "There are not enough suitable seats to " +
                        "separate students from the same class."
                );
            }


            // -------------------------------------------------
            // Create allocation
            // -------------------------------------------------

            SeatAllocation allocation =
                    new SeatAllocation();

            allocation.setExamSession(exam);

            allocation.setStudent(student);

            allocation.setSeat(selectedSeat);


            allocations.add(allocation);
        }


        // -----------------------------------------------------
        // 13. Save generated allocations
        // -----------------------------------------------------

        return seatAllocationRepository
                .saveAll(allocations);
    }


    // =========================================================
    // CHECK WHETHER SEAT IS ALREADY USED
    // =========================================================

    private boolean isSeatAlreadyUsed(
            Seat seat,
            List<SeatAllocation> allocations) {


        for (SeatAllocation allocation : allocations) {

            if (allocation.getSeat() != null
                    && allocation.getSeat().getId() != null
                    && allocation.getSeat().getId()
                    .equals(seat.getId())) {

                return true;
            }
        }


        return false;
    }


    // =========================================================
    // CHECK WHETHER STUDENT CAN SIT IN THIS SEAT
    // =========================================================

    private boolean isSafeSeat(
            Seat seat,
            Student student,
            List<SeatAllocation> allocations) {


        for (SeatAllocation allocation : allocations) {

            Seat occupiedSeat =
                    allocation.getSeat();

            Student occupiedStudent =
                    allocation.getStudent();


            if (occupiedSeat == null
                    || occupiedStudent == null) {

                continue;
            }


            // -------------------------------------------------
            // Check only the selected hall
            // -------------------------------------------------

            if (occupiedSeat.getHall() == null
                    || seat.getHall() == null) {

                continue;
            }


            if (occupiedSeat.getHall().getId() == null
                    || seat.getHall().getId() == null) {

                continue;
            }


            if (!occupiedSeat.getHall()
                    .getId()
                    .equals(seat.getHall().getId())) {

                continue;
            }


            // -------------------------------------------------
            // Check whether seats are adjacent
            // -------------------------------------------------

            if (isAdjacent(
                    seat,
                    occupiedSeat)) {


                // Same class nearby is not allowed

                if (sameClass(
                        student,
                        occupiedStudent)) {

                    return false;
                }
            }
        }


        return true;
    }


    // =========================================================
    // CHECK ADJACENT SEATS
    // =========================================================

    private boolean isAdjacent(
            Seat seat1,
            Seat seat2) {


        int rowDifference =
                Math.abs(
                        seat1.getRowNumber()
                                - seat2.getRowNumber()
                );


        int columnDifference =
                Math.abs(
                        seat1.getColumnNumber()
                                - seat2.getColumnNumber()
                );


        /*
         * Adjacent means:
         *
         * Left
         * Right
         * Front
         * Back
         * Diagonal
         */

        return rowDifference <= 1
                && columnDifference <= 1
                && !(rowDifference == 0
                && columnDifference == 0);
    }


    // =========================================================
    // CHECK SAME CLASS / SECTION
    // =========================================================

    private boolean sameClass(
            Student student1,
            Student student2) {


        if (student1.getClassSection() == null
                || student2.getClassSection() == null) {

            return false;
        }


        return student1
                .getClassSection()
                .trim()
                .equalsIgnoreCase(
                        student2
                                .getClassSection()
                                .trim()
                );
    }
}