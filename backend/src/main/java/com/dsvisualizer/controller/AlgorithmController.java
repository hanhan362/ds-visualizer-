package com.dsvisualizer.controller;

import com.dsvisualizer.dto.*;
import com.dsvisualizer.service.AlgorithmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AlgorithmController {

    private final AlgorithmService service;

    public AlgorithmController(AlgorithmService service) {
        this.service = service;
    }

    /** GET /api/algorithms — 获取所有算法元信息 */
    @GetMapping("/algorithms")
    public List<AlgorithmMetaDto> getAlgorithms() {
        return service.getAlgorithms();
    }

    /** POST /api/sort/{algorithm} — 运行排序算法 */
    @PostMapping("/sort/{algorithm}")
    public ResponseEntity<?> runSort(
            @PathVariable String algorithm,
            @RequestBody SortRequest request) {
        try {
            SortResponse response = service.runSort(algorithm, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /api/sort/history — 获取执行历史 */
    @GetMapping("/sort/history")
    public List<SortResponse> getHistory(
            @RequestParam(required = false) String algorithm) {
        return service.getHistory(algorithm);
    }
}
