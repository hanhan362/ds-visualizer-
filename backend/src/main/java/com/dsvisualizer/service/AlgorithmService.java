package com.dsvisualizer.service;

import com.dsvisualizer.dto.*;
import com.dsvisualizer.engine.*;
import com.dsvisualizer.entity.*;
import com.dsvisualizer.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AlgorithmService {

    private final Map<String, SortEngine> engines;
    private final AlgorithmRepository algorithmRepo;
    private final ExecutionHistoryRepository historyRepo;

    public AlgorithmService(AlgorithmRepository algorithmRepo,
                            ExecutionHistoryRepository historyRepo) {
        this.algorithmRepo = algorithmRepo;
        this.historyRepo = historyRepo;

        // 注册所有引擎
        List<SortEngine> engineList = List.of(
            new BubbleSort(), new SelectionSort(), new InsertionSort(),
            new QuickSort(), new MergeSort()
        );
        engines = engineList.stream()
            .collect(Collectors.toMap(SortEngine::getId, e -> e));
    }

    public List<AlgorithmMetaDto> getAlgorithms() {
        return algorithmRepo.findAll().stream()
            .map(a -> new AlgorithmMetaDto(
                a.getId(), a.getName(), a.getTimeComplexity(),
                a.getSpaceComplexity(), a.isStable()))
            .collect(Collectors.toList());
    }

    public SortResponse runSort(String algorithmId, SortRequest request) {
        SortEngine engine = engines.get(algorithmId);
        if (engine == null) {
            throw new IllegalArgumentException("未知算法: " + algorithmId);
        }

        long start = System.currentTimeMillis();
        List<SortStepDto> steps = engine.run(request.array());
        long elapsed = System.currentTimeMillis() - start;

        SortStepDto last = steps.get(steps.size() - 1);

        // 记录执行历史
        ExecutionHistoryEntity history = new ExecutionHistoryEntity(
            algorithmId, request.array().length, last.comparisons(), last.swaps(), elapsed
        );
        historyRepo.save(history);

        return new SortResponse(
            algorithmId, steps,
            new SortResponse.Stats(last.comparisons(), last.swaps(), elapsed)
        );
    }

    public List<SortResponse> getHistory(String algorithmId) {
        List<ExecutionHistoryEntity> histories;
        if (algorithmId != null && !algorithmId.isEmpty()) {
            histories = historyRepo.findByAlgorithmIdOrderByCreatedAtDesc(algorithmId);
        } else {
            histories = historyRepo.findAll();
        }

        return histories.stream().map(h -> new SortResponse(
            h.getAlgorithmId(), List.of(),
            new SortResponse.Stats(h.getComparisons(), h.getSwaps(), h.getTimeMs())
        )).collect(Collectors.toList());
    }
}
