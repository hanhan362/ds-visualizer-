package com.dsvisualizer.engine;

import com.dsvisualizer.dto.SortStepDto;
import java.util.ArrayList;
import java.util.List;

public class BubbleSort implements SortEngine {

    @Override
    public String getId() { return "bubble"; }

    @Override
    public List<SortStepDto> run(int[] input) {
        List<SortStepDto> steps = new ArrayList<>();
        int n = input.length;
        int[] arr = input.clone();
        List<Integer> sorted = new ArrayList<>();
        int comparisons = 0, swaps = 0;

        for (int i = 0; i < n - 1; i++) {
            boolean swappedThisPass = false;
            for (int j = 0; j < n - 1 - i; j++) {
                comparisons++;
                steps.add(new SortStepDto(
                    arr.clone(), new int[]{j, j + 1}, new int[]{-1, -1},
                    sortedListToArray(sorted), comparisons, swaps
                ));

                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                    swaps++;
                    swappedThisPass = true;

                    steps.add(new SortStepDto(
                        arr.clone(), new int[]{j, j + 1}, new int[]{j, j + 1},
                        sortedListToArray(sorted), comparisons, swaps
                    ));
                }
            }
            sorted.add(n - 1 - i);

            if (!swappedThisPass) {
                for (int k = n - 2 - i; k >= 0; k--) sorted.add(k);
                break;
            }
        }

        for (int i = 0; i < n; i++) {
            if (!sorted.contains(i)) sorted.add(i);
        }

        return steps;
    }

    private static int[] sortedListToArray(List<Integer> list) {
        return list.stream().mapToInt(Integer::intValue).toArray();
    }
}
