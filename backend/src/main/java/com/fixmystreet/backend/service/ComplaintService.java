package com.fixmystreet.backend.service;

import com.fixmystreet.backend.dto.ComplaintRequest;
import com.fixmystreet.backend.dto.StageUpdateRequest;
import com.fixmystreet.backend.entity.Complaint;
import com.fixmystreet.backend.entity.StatusHistory;
import com.fixmystreet.backend.repository.ComplaintRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ComplaintService implements CommandLineRunner {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Optional<Complaint> getComplaintById(String id) {
        return complaintRepository.findById(id.trim().toUpperCase());
    }

    @Transactional
    public Complaint createComplaint(ComplaintRequest req) {
        String newId = generateNextId();
        String now = Instant.now().toString();

        Complaint c = new Complaint();
        c.setId(newId);
        c.setCat(req.getCat());
        c.setCategoryLabel(req.getCategoryLabel() != null ? req.getCategoryLabel() : req.getCat());
        c.setDesc(req.getDesc());
        c.setOtherDetails(req.getOtherDetails());
        c.setArea(req.getArea());
        c.setLat(req.getLat());
        c.setLng(req.getLng());
        c.setStage(0);
        c.setBy(req.getBy() != null && !req.getBy().isBlank() ? req.getBy() : "Citizen");
        c.setProof(false);
        c.setProofImg(req.getPhoto());

        c.addHistory(0, now);

        return complaintRepository.save(c);
    }

    @Transactional
    public Complaint updateStage(String id, StageUpdateRequest req) {
        Complaint c = complaintRepository.findById(id.trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

        String now = Instant.now().toString();

        if (req.getStage() != null && !req.getStage().equals(c.getStage())) {
            c.setStage(req.getStage());
            c.addHistory(req.getStage(), now);
        }

        if (req.getTeam() != null) {
            c.setTeam(req.getTeam());
        }

        if (req.getProof() != null) {
            c.setProof(req.getProof());
        }

        if (req.getProofImg() != null) {
            c.setProofImg(req.getProofImg());
        }

        if (req.getRating() != null) {
            c.setRating(req.getRating());
        }

        if (req.getNotes() != null) {
            for (Map<String, String> n : req.getNotes()) {
                String text = n.get("t");
                String at = n.getOrDefault("at", now);
                if (text != null && !text.isBlank()) {
                    c.addNote(text, at);
                }
            }
        }

        return complaintRepository.save(c);
    }

    @Transactional
    public Complaint addNote(String id, String noteText) {
        Complaint c = complaintRepository.findById(id.trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

        c.addNote(noteText, Instant.now().toString());
        return complaintRepository.save(c);
    }

    private synchronized String generateNextId() {
        List<String> ids = complaintRepository.findAllIds();
        int max = 100;
        for (String id : ids) {
            if (id != null && id.startsWith("FMS-")) {
                try {
                    int num = Integer.parseInt(id.substring(4));
                    if (num > max) {
                        max = num;
                    }
                } catch (NumberFormatException ignored) {}
            }
        }
        return "FMS-" + (max + 1);
    }

    @Override
    public void run(String... args) {
        if (complaintRepository.count() == 0) {
            seedInitialComplaints();
        }
    }

    private void seedInitialComplaints() {
        seedItem("FMS-101", "pothole", "Roads & Potholes", "Deep pothole near the bus stop, two-wheelers swerve into traffic.", "T. Nagar", 13.0418, 80.2341, 0, 1, "Priya Raman", null, false, null);
        seedItem("FMS-102", "pothole", "Roads & Potholes", "Large pothole outside the Pondy Bazaar entrance.", "T. Nagar", 13.04205, 80.23435, 0, 3, "Karthik S", null, false, null);
        seedItem("FMS-103", "garbage", "Garbage & Waste", "Garbage heap not cleared for a week on 2nd Main Road.", "Adyar", 13.0012, 80.2565, 2, 6, "Priya Raman", "Sanitation Wing", false, null);
        seedItem("FMS-104", "leakage", "Water Supply", "Drinking water pipe leaking onto the road.", "Velachery", 12.9815, 80.2180, 3, 4, "Meena L", "Metro Water", false, null);
        seedItem("FMS-105", "light", "Street Lights", "Three streetlights are out along the service road.", "Guindy", 13.0067, 80.2206, 1, 2, "Priya Raman", null, false, null);
        seedItem("FMS-106", "pothole", "Roads & Potholes", "Road caved in after rain near the signal.", "Anna Nagar", 13.0850, 80.2101, 2, 2, "Arun V", "Zone 4 Roads", false, null);
        seedItem("FMS-107", "garbage", "Garbage & Waste", "Overflowing bins near the vegetable market.", "Mylapore", 13.0368, 80.2676, 4, 8, "Priya Raman", "Sanitation Wing", true, null);
        seedItem("FMS-108", "leakage", "Water Supply", "Sewage overflowing into the lane.", "Perambur", 13.1167, 80.2333, 0, 7, "Divya R", null, false, null);
        seedItem("FMS-109", "pothole", "Roads & Potholes", "Broken tar patch where the highway merges.", "Tambaram", 12.9249, 80.1000, 3, 3, "Priya Raman", "Zone 4 Roads", false, null);
        seedItem("FMS-110", "light", "Street Lights", "Dark stretch outside the school gate.", "Velachery", 12.9790, 80.2210, 5, 10, "Priya Raman", "Lighting Cell", true, 4);
    }

    private void seedItem(String id, String cat, String label, String desc, String area, double lat, double lng, int stage, int ageDays, String by, String team, boolean proof, Integer rating) {
        Complaint c = new Complaint();
        c.setId(id);
        c.setCat(cat);
        c.setCategoryLabel(label);
        c.setDesc(desc);
        c.setArea(area);
        c.setLat(lat);
        c.setLng(lng);
        c.setStage(stage);
        c.setBy(by);
        c.setTeam(team);
        c.setProof(proof);
        c.setRating(rating);

        long nowMs = System.currentTimeMillis();
        for (int i = 0; i <= stage; i++) {
            double daysAgo = Math.max(ageDays - i * 1.2, 0);
            long timeMs = nowMs - (long) (daysAgo * 86400000L);
            c.addHistory(i, Instant.ofEpochMilli(timeMs).toString());
        }

        complaintRepository.save(c);
    }
}
