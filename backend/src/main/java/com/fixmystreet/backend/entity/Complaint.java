package com.fixmystreet.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 50)
    private String cat;

    @Column(name = "category_label", length = 100)
    private String categoryLabel;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String desc;

    @Column(name = "other_details")
    private String otherDetails;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(nullable = false)
    private Integer stage = 0;

    @Column(name = "by_citizen", nullable = false, length = 100)
    @JsonProperty("by")
    private String by;

    @Column(length = 100)
    private String team;

    private Boolean proof = false;

    @Column(name = "proof_img", columnDefinition = "LONGTEXT")
    private String proofImg;

    private Integer rating;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    @OrderBy("id ASC")
    private List<StatusHistory> history = new ArrayList<>();

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    @OrderBy("id ASC")
    private List<ComplaintNote> notes = new ArrayList<>();

    public Complaint() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCat() {
        return cat;
    }

    public void setCat(String cat) {
        this.cat = cat;
    }

    public String getCategoryLabel() {
        return categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getOtherDetails() {
        return otherDetails;
    }

    public void setOtherDetails(String otherDetails) {
        this.otherDetails = otherDetails;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Integer getStage() {
        return stage;
    }

    public void setStage(Integer stage) {
        this.stage = stage;
    }

    public String getBy() {
        return by;
    }

    public void setBy(String by) {
        this.by = by;
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

    public List<StatusHistory> getHistory() {
        return history;
    }

    public void setHistory(List<StatusHistory> history) {
        this.history = history;
    }

    public List<ComplaintNote> getNotes() {
        return notes;
    }

    public void setNotes(List<ComplaintNote> notes) {
        this.notes = notes;
    }

    public void addHistory(Integer newStage, String timestamp) {
        this.history.add(new StatusHistory(newStage, timestamp, this));
    }

    public void addNote(String noteText, String timestamp) {
        this.notes.add(new ComplaintNote(noteText, timestamp, this));
    }
}
