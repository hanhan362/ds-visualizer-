package com.dsvisualizer.dto;

public record AlgorithmMetaDto(
    String id,
    String name,
    String timeComplexity,
    String spaceComplexity,
    boolean stable
) {}
