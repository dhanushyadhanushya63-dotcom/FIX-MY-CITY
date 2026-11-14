package com.fixmystreet.backend.controller;

import com.fixmystreet.backend.dto.ComplaintRequest;
import com.fixmystreet.backend.dto.NoteRequest;
import com.fixmystreet.backend.dto.StageUpdateRequest;
import com.fixmystreet.backend.entity.Complaint;
import com.fixmystreet.backend.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable String id) {
        return complaintService.getComplaintById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintRequest req) {
        Complaint created = complaintService.createComplaint(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/stage")
    public ResponseEntity<Complaint> updateStage(
            @PathVariable String id,
            @RequestBody StageUpdateRequest req) {
        return ResponseEntity.ok(complaintService.updateStage(id, req));
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<Complaint> addNote(
            @PathVariable String id,
            @Valid @RequestBody NoteRequest req) {
        return ResponseEntity.ok(complaintService.addNote(id, req.getT()));
    }
}
