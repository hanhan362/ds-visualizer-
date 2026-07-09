package com.dsvisualizer.controller;

import com.dsvisualizer.entity.ProgressEntity;
import com.dsvisualizer.repository.ProgressRepository;
import com.dsvisualizer.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressRepository progressRepo;
    private final UserRepository userRepo;

    public ProgressController(ProgressRepository progressRepo, UserRepository userRepo) {
        this.progressRepo = progressRepo;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<?> recordProgress(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        if (auth == null) return ResponseEntity.ok(Map.of("saved", false, "reason", "not logged in"));

        var userOpt = userRepo.findByUsername(auth.getName());
        if (userOpt.isEmpty()) return ResponseEntity.ok(Map.of("saved", false));

        String algorithmId = (String) body.get("algorithmId");
        int steps = body.get("steps") instanceof Integer ? (int) body.get("steps") : 0;
        int score = body.getOrDefault("score", 100) instanceof Integer ? (int) body.get("score") : 100;

        ProgressEntity progress = new ProgressEntity(userOpt.get().getId(), algorithmId, steps, score);
        progressRepo.save(progress);
        return ResponseEntity.ok(Map.of("saved", true));
    }

    @GetMapping
    public ResponseEntity<?> getProgress(Authentication auth) {
        if (auth == null) return ResponseEntity.ok(List.of());
        var userOpt = userRepo.findByUsername(auth.getName());
        if (userOpt.isEmpty()) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(progressRepo.findByUserIdOrderByFinishedAtDesc(userOpt.get().getId()));
    }
}
