package com.dsvisualizer.dto;

import java.util.List;

public record SortResponse(
    String algorithm,
    List<SortStepDto> steps,
    Stats stats
) {
    public record Stats(int comparisons, int swaps, long timeMs) {}
}
