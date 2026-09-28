package com.seatplan.exam_hall_seating.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.seatplan.exam_hall_seating.entity.Hall;
import com.seatplan.exam_hall_seating.repository.HallRepository;

@Service
public class HallService {

    private final HallRepository hallRepository;

    public HallService(HallRepository hallRepository) {
        this.hallRepository = hallRepository;
    }

    public Hall saveHall(Hall hall) {
        return hallRepository.save(hall);
    }

    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    public Hall getHallById(Long id) {
        return hallRepository.findById(id).orElse(null);
    }

    public void deleteHall(Long id) {
        hallRepository.deleteById(id);
    }
}