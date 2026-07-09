package com.dsvisualizer.repository;

import com.dsvisualizer.entity.FavoriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {
    List<FavoriteEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<FavoriteEntity> findByUserIdAndStructure(Long userId, String structure);

    @Transactional
    void deleteByUserIdAndStructure(Long userId, String structure);
}
