package com.dsvisualizer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites")
public class FavoriteEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String structure;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FavoriteEntity() {}
    public FavoriteEntity(Long userId, String structure) {
        this.userId = userId; this.structure = structure; this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getStructure() { return structure; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long id) { this.userId = id; }
    public void setStructure(String s) { this.structure = s; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }
}
