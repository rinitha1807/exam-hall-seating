package com.seatplan.exam_hall_seating.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.seatplan.exam_hall_seating.entity.Seat;
import com.seatplan.exam_hall_seating.repository.SeatRepository;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public Seat saveSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public Seat getSeatById(Long id) {
        return seatRepository.findById(id).orElse(null);
    }

    public void deleteSeat(Long id) {
        seatRepository.deleteById(id);
    }
}