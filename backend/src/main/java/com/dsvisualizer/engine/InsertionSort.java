package com.dsvisualizer.engine;

import com.dsvisualizer.dto.SortStepDto;
import java.util.ArrayList;
import java.util.List;

public class InsertionSort implements SortEngine {

    @Override
    public String getId() { return "insertion"; }

    @Override
    public List<SortStepDto> run(int[] input) {
        List<SortStepDto> steps = new ArrayList<>();
        int n = input.length;
        int[] arr = input.clone();
        List<Integer> sorted = new ArrayList<>();
        sorted.add(0);
        int comparisons = 0, swaps = 0;

        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;

            while (j >= 0) {
                comparisons++;
                steps.add(new SortStepDto(
                    arr.clone(), new int[]{j, j + 1}, new int[]{-1, -1},
                    sorted.stream().mapToInt(Integer::intValue).toArray(), comparisons, swaps
                ));

                if (arr[j] > key) {
                    arr[j + 1] = arr[j];
                    swaps++;
                    steps.add(new SortStepDto(
                        arr.clone(), new int[]{j, j + 1}, new int[]{j, j + 1},
                        sorted.stream().mapToInt(Integer::intValue).toArray(), comparisons, swaps
                    ));
                    j--;
                } else {
                    break;
                }
            }
            arr[j + 1] = key;
            sorted.add(i);
        }

        return steps;
    }
}
