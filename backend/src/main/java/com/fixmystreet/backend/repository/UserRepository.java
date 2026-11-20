package com.fixmystreet.backend.repository;

import com.fixmystreet.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    List<User> findByRole(String role);
    Optional<User> findByEmail(String email);
    Optional<User> findByContact(String contact);
}
