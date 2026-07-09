package com.dsvisualizer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "history")
public class HistoryEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String structure;

    @Column(nullable = false, length = 50)
    private String operation;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public HistoryEntity() {}
    public HistoryEntity(Long userId, String structure, String operation) {
        this.userId = userId; this.structure = structure; this.operation = operation;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getStructure() { return structure; }
    public String getOperation() { return operation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long id) { this.userId = id; }
    public void setStructure(String s) { this.structure = s; }
    public void setOperation(String s) { this.operation = s; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }
}
