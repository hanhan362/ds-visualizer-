package com.dsvisualizer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_progress")
public class ProgressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "algorithm_id", nullable = false)
    private String algorithmId;

    @Column(name = "completed_steps")
    private int completedSteps;

    @Column(nullable = false)
    private int score;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt = LocalDateTime.now();

    public ProgressEntity() {}

    public ProgressEntity(Long userId, String algorithmId, int completedSteps, int score) {
        this.userId = userId;
        this.algorithmId = algorithmId;
        this.completedSteps = completedSteps;
        this.score = score;
        this.finishedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getAlgorithmId() { return algorithmId; }
    public int getCompletedSteps() { return completedSteps; }
    public int getScore() { return score; }
    public LocalDateTime getFinishedAt() { return finishedAt; }
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long id) { this.userId = id; }
    public void setAlgorithmId(String s) { this.algorithmId = s; }
    public void setCompletedSteps(int n) { this.completedSteps = n; }
    public void setScore(int n) { this.score = n; }
    public void setFinishedAt(LocalDateTime t) { this.finishedAt = t; }
}
