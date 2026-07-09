package com.dsvisualizer.repository;

import com.dsvisualizer.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
    List<NoteEntity> findByUserIdOrderByUpdatedAtDesc(Long userId);
}
