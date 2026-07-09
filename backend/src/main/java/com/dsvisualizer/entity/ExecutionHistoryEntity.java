package com.dsvisualizer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "execution_history")
public class ExecutionHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "algorithm_id", nullable = false)
    private String algorithmId;

    @Column(name = "input_size", nullable = false)
    private int inputSize;

    @Column(nullable = false)
    private int comparisons;

    @Column(nullable = false)
    private int swaps;

    @Column(name = "time_ms", nullable = false)
    private long timeMs;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ExecutionHistoryEntity() {}

    public ExecutionHistoryEntity(String algorithmId, int inputSize,
                                   int comparisons, int swaps, long timeMs) {
        this.algorithmId = algorithmId;
        this.inputSize = inputSize;
        this.comparisons = comparisons;
        this.swaps = swaps;
        this.timeMs = timeMs;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getAlgorithmId() { return algorithmId; }
    public int getInputSize() { return inputSize; }
    public int getComparisons() { return comparisons; }
    public int getSwaps() { return swaps; }
    public long getTimeMs() { return timeMs; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
