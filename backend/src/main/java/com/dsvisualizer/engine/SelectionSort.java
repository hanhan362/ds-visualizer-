package com.dsvisualizer.engine;

import com.dsvisualizer.dto.SortStepDto;
import java.util.ArrayList;
import java.util.List;

public class SelectionSort implements SortEngine {

    @Override
    public String getId() { return "selection"; }

    @Override
    public List<SortStepDto> run(int[] input) {
        List<SortStepDto> steps = new ArrayList<>();
        int n = input.length;
        int[] arr = input.clone();
        List<Integer> sorted = new ArrayList<>();
        int comparisons = 0, swaps = 0;

        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                comparisons++;
                steps.add(new SortStepDto(
                    arr.clone(), new int[]{minIdx, j}, new int[]{-1, -1},
                    sorted.stream().mapToInt(Integer::intValue).toArray(), comparisons, swaps
                ));
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            if (minIdx != i) {
                int tmp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = tmp;
                swaps++;
                steps.add(new SortStepDto(
                    arr.clone(), new int[]{i, minIdx}, new int[]{i, minIdx},
                    sorted.stream().mapToInt(Integer::intValue).toArray(), comparisons, swaps
                ));
            }
            sorted.add(i);
        }
        sorted.add(n - 1);

        return steps;
    }
}
