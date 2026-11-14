package com.fixmystreet.backend.repository;

import com.fixmystreet.backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {

    List<Complaint> findByBy(String by);

    List<Complaint> findByTeamOrderByStageAsc(String team);

    @Query("SELECT c.id FROM Complaint c")
    List<String> findAllIds();
}
