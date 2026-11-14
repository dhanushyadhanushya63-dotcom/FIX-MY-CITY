package com.fixmystreet.backend.controller;

import com.fixmystreet.backend.entity.Feedback;
import com.fixmystreet.backend.repository.FeedbackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAllByOrderByIdDesc());
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Map<String, String> data) {
        String kind = data.getOrDefault("kind", "feedback");
        String name = data.get("name");
        String email = data.get("email");
        String message = data.getOrDefault("message", "");
        String at = data.getOrDefault("at", Instant.now().toString());

        Feedback fb = new Feedback(kind, name, email, message, at);
        Feedback saved = feedbackRepository.save(fb);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
