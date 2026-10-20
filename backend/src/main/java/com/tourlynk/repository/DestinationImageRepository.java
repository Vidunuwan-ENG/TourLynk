package com.tourlynk.repository;

import com.tourlynk.entity.DestinationImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationImageRepository extends JpaRepository<DestinationImage, Long> {
    List<DestinationImage> findByDestinationIdOrderByDisplayOrderAsc(Long destinationId);
    void deleteByDestinationId(Long destinationId);
}

