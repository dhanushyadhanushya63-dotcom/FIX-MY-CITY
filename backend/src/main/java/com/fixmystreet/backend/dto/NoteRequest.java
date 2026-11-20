package com.fixmystreet.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class NoteRequest {

    @NotBlank(message = "Note text is required")
    @JsonProperty("t")
    private String t;

    public NoteRequest() {}

    public NoteRequest(String t) {
        this.t = t;
    }

    public String getT() {
        return t;
    }

    public void setT(String t) {
        this.t = t;
    }
}
