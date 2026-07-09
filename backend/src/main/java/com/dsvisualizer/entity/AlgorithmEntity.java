package com.dsvisualizer.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "algorithms")
public class AlgorithmEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "time_complexity", nullable = false)
    private String timeComplexity;

    @Column(name = "space_complexity", nullable = false)
    private String spaceComplexity;

    @Column(nullable = false)
    private boolean stable;

    public AlgorithmEntity() {}

    public AlgorithmEntity(String id, String name, String timeComplexity,
                           String spaceComplexity, boolean stable) {
        this.id = id;
        this.name = name;
        this.timeComplexity = timeComplexity;
        this.spaceComplexity = spaceComplexity;
        this.stable = stable;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTimeComplexity() { return timeComplexity; }
    public void setTimeComplexity(String t) { this.timeComplexity = t; }
    public String getSpaceComplexity() { return spaceComplexity; }
    public void setSpaceComplexity(String s) { this.spaceComplexity = s; }
    public boolean isStable() { return stable; }
    public void setStable(boolean s) { this.stable = s; }
}
