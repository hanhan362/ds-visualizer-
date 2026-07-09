package com.dsvisualizer.engine;

import com.dsvisualizer.dto.SortStepDto;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MergeSort implements SortEngine {

    @Override
    public String getId() { return "merge"; }

    @Override
    public List<SortStepDto> run(int[] input) {
        List<SortStepDto> steps = new ArrayList<>();
        int[] arr = input.clone();
        int[] aux = arr.clone();
        Set<Integer> sorted = new HashSet<>();
        int[] counters = {0, 0}; // [comparisons, swaps]

        mergeSortRange(arr, aux, 0, arr.length - 1, sorted, counters, steps);

        return steps;
    }

    private void mergeSortRange(int[] arr, int[] aux, int lo, int hi,
                                 Set<Integer> sorted, int[] counters,
                                 List<SortStepDto> steps) {
        if (lo >= hi) {
            sorted.add(lo);
            return;
        }

        int mid = lo + (hi - lo) / 2;
        mergeSortRange(arr, aux, lo, mid, sorted, counters, steps);
        mergeSortRange(arr, aux, mid + 1, hi, sorted, counters, steps);
        merge(arr, aux, lo, mid, hi, sorted, counters, steps);

        if (lo == 0 && hi == arr.length - 1) {
            for (int i = 0; i < arr.length; i++) sorted.add(i);
        }
    }

    private void merge(int[] arr, int[] aux, int lo, int mid, int hi,
                        Set<Integer> sorted, int[] counters,
                        List<SortStepDto> steps) {
        for (int k = lo; k <= hi; k++) aux[k] = arr[k];

        int i = lo, j = mid + 1;

        for (int k = lo; k <= hi; k++) {
            if (i > mid) {
                arr[k] = aux[j++];
                counters[1]++;
            } else if (j > hi) {
                arr[k] = aux[i++];
                counters[1]++;
            } else {
                counters[0]++;
                steps.add(new SortStepDto(
                    arr.clone(), new int[]{i, j}, new int[]{-1, -1},
                    sorted.stream().mapToInt(Integer::intValue).toArray(),
                    counters[0], counters[1]
                ));

                if (aux[i] <= aux[j]) {
                    arr[k] = aux[i++];
                } else {
                    arr[k] = aux[j++];
                }
                counters[1]++;

                steps.add(new SortStepDto(
                    arr.clone(), new int[]{i - 1, j - 1}, new int[]{-1, k},
                    sorted.stream().mapToInt(Integer::intValue).toArray(),
                    counters[0], counters[1]
                ));
            }
        }
    }
}
