package com.seatplan.exam_hall_seating.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seatplan.exam_hall_seating.entity.ExamSession;

public interface ExamSessionRepository
        extends JpaRepository<ExamSession, Long> {

}