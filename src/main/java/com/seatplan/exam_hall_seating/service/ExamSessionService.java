package com.seatplan.exam_hall_seating.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.seatplan.exam_hall_seating.entity.ExamSession;
import com.seatplan.exam_hall_seating.repository.ExamSessionRepository;

@Service
public class ExamSessionService {

    private final ExamSessionRepository examSessionRepository;

    public ExamSessionService(ExamSessionRepository examSessionRepository) {
        this.examSessionRepository = examSessionRepository;
    }

    public ExamSession saveExamSession(ExamSession examSession) {
        return examSessionRepository.save(examSession);
    }

    public List<ExamSession> getAllExamSessions() {
        return examSessionRepository.findAll();
    }

    public ExamSession getExamSessionById(Long id) {
        return examSessionRepository.findById(id).orElse(null);
    }

    public void deleteExamSession(Long id) {
        examSessionRepository.deleteById(id);
    }
}