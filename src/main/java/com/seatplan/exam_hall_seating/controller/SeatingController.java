package com.seatplan.exam_hall_seating.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.seatplan.exam_hall_seating.entity.SeatAllocation;
import com.seatplan.exam_hall_seating.service.SeatingService;

@RestController
@RequestMapping("/allocations")
public class SeatingController {

    private final SeatingService seatingService;

    public SeatingController(SeatingService seatingService) {
        this.seatingService = seatingService;
    }

    @PostMapping
    public SeatAllocation createAllocation(
            @RequestBody SeatAllocation allocation) {

        return seatingService.saveAllocation(allocation);
    }

    @GetMapping
    public List<SeatAllocation> getAllAllocations() {

        return seatingService.getAllAllocations();
    }

    @GetMapping("/{id}")
    public SeatAllocation getAllocationById(
            @PathVariable Long id) {

        return seatingService.getAllocationById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteAllocation(
            @PathVariable Long id) {

        seatingService.deleteAllocation(id);
    }

    @PostMapping("/generate")
    public List<SeatAllocation> generateSeating(
            @RequestParam Long examId,
            @RequestParam Long hallId) {

        return seatingService.generateSeating(
                examId,
                hallId
        );
    }
}