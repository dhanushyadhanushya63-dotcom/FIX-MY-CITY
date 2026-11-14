package com.fixmystreet.backend.dto;

import java.util.List;
import java.util.Map;

public class StageUpdateRequest {

    private Integer stage;
    private String team;
    private Boolean proof;
    private String proofImg;
    private Integer rating;
    private List<Map<String, String>> notes;

    public StageUpdateRequest() {}

    public Integer getStage() {
        return stage;
    }

    public void setStage(Integer stage) {
        this.stage = stage;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public Boolean getProof() {
        return proof;
    }

    public void setProof(Boolean proof) {
        this.proof = proof;
    }

    public String getProofImg() {
        return proofImg;
    }

    public void setProofImg(String proofImg) {
        this.proofImg = proofImg;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public List<Map<String, String>> getNotes() {
        return notes;
    }

    public void setNotes(List<Map<String, String>> notes) {
        this.notes = notes;
    }
}
