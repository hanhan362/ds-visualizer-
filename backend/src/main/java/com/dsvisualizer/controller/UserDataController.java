package com.dsvisualizer.controller;

import com.dsvisualizer.dto.R;
import com.dsvisualizer.entity.*;
import com.dsvisualizer.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserDataController {

    private final HistoryRepository historyRepo;
    private final FavoriteRepository favoriteRepo;
    private final NoteRepository noteRepo;
    private final UserRepository userRepo;

    public UserDataController(HistoryRepository hr, FavoriteRepository fr, NoteRepository nr, UserRepository ur) {
        this.historyRepo = hr; this.favoriteRepo = fr; this.noteRepo = nr; this.userRepo = ur;
    }

    private Long getUserId(Authentication auth) {
        if (auth == null) return null;
        return userRepo.findByUsername(auth.getName()).map(UserEntity::getId).orElse(null);
    }

    // ── History ──
    @GetMapping("/history")
    public R getHistory(Authentication auth) {
        Long uid = getUserId(auth);
        if (uid == null) return R.ok(null);
        return R.ok(historyRepo.findByUserIdOrderByCreatedAtDesc(uid));
    }

    @PostMapping("/history")
    public R addHistory(@RequestBody Map<String, String> body, Authentication auth) {
        Long uid = getUserId(auth);
        if (uid == null) return R.ok(Map.of("saved", false));
        HistoryEntity h = new HistoryEntity(uid, body.get("structure"), body.get("operation"));
        historyRepo.save(h);
        return R.ok(Map.of("saved", true));
    }

    // ── Favorites ──
    @GetMapping("/favorites")
    public R getFavorites(Authentication auth) {
        Long uid = getUserId(auth);
        if (uid == null) return R.ok(null);
        return R.ok(favoriteRepo.findByUserIdOrderByCreatedAtDesc(uid));
    }

    @PostMapping("/favorites")
    public R addFavorite(@RequestBody Map<String, String> body, Authentication auth) {
        Long uid = getUserId(auth);
        if (uid == null) return R.ok(Map.of("saved", false));
        String structure = body.get("structure");
        if (favoriteRepo.findByUserIdAndStructure(uid, structure).isEmpty()) {
            favoriteRepo.save(new FavoriteEntity(uid, structure));
            return R.ok(Map.of("saved", true, "favorited", true));
        }
        favoriteRepo.deleteByUserIdAndStructure(uid, structure);
        return R.ok(Map.of("saved", true, "favorited", false));
    }

    // ── Notes ──
    @GetMapping("/notes")
    public R getNotes(Authentication auth) {
        Long uid = getUserId(auth);
        if (uid == null) return R.ok(null);
        return R.ok(noteRepo.findByUserIdOrderByUpdatedAtDesc(uid));
    }

    @PostMapping("/notes")
    public R addNote(@RequestBody Map<String, String> body, Authentication auth) {
        Long uid = getUserId(auth);
        if (uid == null) return R.ok(Map.of("saved", false));
        NoteEntity n = new NoteEntity(uid, body.get("content"));
        noteRepo.save(n);
        return R.ok(Map.of("saved", true, "id", n.getId()));
    }
}
