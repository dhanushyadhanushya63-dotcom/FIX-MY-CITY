package com.fixmystreet.backend.controller;

import com.fixmystreet.backend.entity.User;
import com.fixmystreet.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String role) {
        if (role != null && !role.isEmpty()) {
            return ResponseEntity.ok(userRepository.findByRole(role));
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody Map<String, String> data) {
        String role = data.getOrDefault("role", "citizen");
        String name = data.getOrDefault("name", "Citizen");
        String email = data.get("email");
        String contact = data.get("contact");
        String team = data.get("team");
        String area = data.get("area");

        String id = (role.equals("admin") ? "ADM-" : role.equals("authority") ? "AUTH-" : "CIT-")
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        User user = new User(id, name, role, email, contact, team, area);
        user.setCreatedAt(Instant.now().toString());
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String identifier = creds.get("identifier"); // email or contact or id
        String role = creds.get("role");

        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Identifier required"));
        }

        // Try find by id
        Optional<User> byId = userRepository.findById(identifier);
        if (byId.isPresent()) {
            return ResponseEntity.ok(byId.get());
        }

        // Try find by email
        Optional<User> byEmail = userRepository.findByEmail(identifier);
        if (byEmail.isPresent()) {
            return ResponseEntity.ok(byEmail.get());
        }

        // Try find by contact
        Optional<User> byContact = userRepository.findByContact(identifier);
        if (byContact.isPresent()) {
            return ResponseEntity.ok(byContact.get());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found"));
    }
}
