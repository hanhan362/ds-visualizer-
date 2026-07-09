package com.dsvisualizer.dto;

import java.util.List;

public record SortStepDto(
    int[] array,
    int[] compared,
    int[] swapped,
    int[] sorted,
    int comparisons,
    int swaps
) {}
