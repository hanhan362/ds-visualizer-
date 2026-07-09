package com.dsvisualizer.repository;

import com.dsvisualizer.entity.ExecutionHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExecutionHistoryRepository extends JpaRepository<ExecutionHistoryEntity, Long> {
    List<ExecutionHistoryEntity> findByAlgorithmIdOrderByCreatedAtDesc(String algorithmId);
}
