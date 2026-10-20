package com.tourlynk.repository;

import com.tourlynk.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    Optional<District> findByName(String name);
    List<District> findAllByOrderByNameAsc();
}

