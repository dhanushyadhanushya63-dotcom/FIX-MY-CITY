package com.fixmystreet.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String role; // citizen, admin, authority

    @Column(length = 150)
    private String email;

    @Column(length = 50)
    private String contact;

    @Column(length = 100)
    private String team;

    @Column(length = 255)
    private String area;

    @Column(name = "created_at")
    private String createdAt = Instant.now().toString();

    public User() {}

    public User(String id, String name, String role, String email, String contact, String team, String area) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.email = email;
        this.contact = contact;
        this.team = team;
        this.area = area;
        this.createdAt = Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getTeam() { return team; }
    public void setTeam(String team) { this.team = team; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
