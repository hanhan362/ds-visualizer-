package com.dsvisualizer.engine;

import com.dsvisualizer.dto.SortStepDto;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class QuickSort implements SortEngine {

    @Override
    public String getId() { return "quick"; }

    @Override
    public List<SortStepDto> run(int[] input) {
        List<SortStepDto> steps = new ArrayList<>();
        int[] arr = input.clone();
        Set<Integer> sorted = new HashSet<>();
        int[] counters = {0, 0}; // [comparisons, swaps]

        quickSortRange(arr, 0, arr.length - 1, sorted, counters, steps);

        return steps;
    }

    private void quickSortRange(int[] arr, int lo, int hi, Set<Integer> sorted,
                                 int[] counters, List<SortStepDto> steps) {
        if (lo >= hi) {
            sorted.add(lo);
            return;
        }

        int pi = partition(arr, lo, hi, sorted, counters, steps);

        if (pi - 1 > lo) {
            quickSortRange(arr, lo, pi - 1, sorted, counters, steps);
        } else {
            sorted.add(lo);
        }

        if (pi + 1 < hi) {
            quickSortRange(arr, pi + 1, hi, sorted, counters, steps);
        } else {
            sorted.add(hi);
        }
    }

    private int partition(int[] arr, int lo, int hi, Set<Integer> sorted,
                           int[] counters, List<SortStepDto> steps) {
        int pivot = arr[hi];
        int i = lo - 1;

        for (int j = lo; j < hi; j++) {
            counters[0]++;
            steps.add(new SortStepDto(
                arr.clone(), new int[]{j, hi}, new int[]{-1, -1},
                sorted.stream().mapToInt(Integer::intValue).toArray(),
                counters[0], counters[1]
            ));

            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
                counters[1]++;
                steps.add(new SortStepDto(
                    arr.clone(), new int[]{i, j}, new int[]{i, j},
                    sorted.stream().mapToInt(Integer::intValue).toArray(),
                    counters[0], counters[1]
                ));
            }
        }

        swap(arr, i + 1, hi);
        if (i + 1 != hi) {
            counters[1]++;
            steps.add(new SortStepDto(
                arr.clone(), new int[]{i + 1, hi}, new int[]{i + 1, hi},
                sorted.stream().mapToInt(Integer::intValue).toArray(),
                counters[0], counters[1]
            ));
        }

        sorted.add(i + 1);
        return i + 1;
    }

    private void swap(int[] arr, int a, int b) {
        int tmp = arr[a];
        arr[a] = arr[b];
        arr[b] = tmp;
    }
}
