package com.dsvisualizer.repository;

import com.dsvisualizer.entity.ProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgressRepository extends JpaRepository<ProgressEntity, Long> {
    List<ProgressEntity> findByUserIdOrderByFinishedAtDesc(Long userId);
    List<ProgressEntity> findByUserIdAndAlgorithmId(Long userId, String algorithmId);
}
