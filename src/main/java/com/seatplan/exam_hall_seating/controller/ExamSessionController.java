package com.seatplan.exam_hall_seating.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatplan.exam_hall_seating.entity.ExamSession;
import com.seatplan.exam_hall_seating.service.ExamSessionService;

@RestController
@RequestMapping("/exam-sessions")
public class ExamSessionController {

    private final ExamSessionService examSessionService;

    public ExamSessionController(ExamSessionService examSessionService) {
        this.examSessionService = examSessionService;
    }

    @PostMapping
    public ExamSession createExamSession(
            @RequestBody ExamSession examSession) {

        return examSessionService.saveExamSession(examSession);
    }

    @GetMapping
    public List<ExamSession> getAllExamSessions() {
        return examSessionService.getAllExamSessions();
    }

    @GetMapping("/{id}")
    public ExamSession getExamSessionById(@PathVariable Long id) {
        return examSessionService.getExamSessionById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteExamSession(@PathVariable Long id) {
        examSessionService.deleteExamSession(id);
    }
}