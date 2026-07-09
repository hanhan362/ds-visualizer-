package com.dsvisualizer.controller;

import com.dsvisualizer.dto.R;
import com.dsvisualizer.entity.UserEntity;
import com.dsvisualizer.repository.UserRepository;
import com.dsvisualizer.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public R register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.isBlank()) return R.error("用户名不能为空");
        if (password == null || password.length() < 6) return R.error("密码长度不能少于6位");
        if (userRepo.findByUsername(username).isPresent()) return R.error("用户名已存在");

        UserEntity user = new UserEntity(username, encoder.encode(password), username + "@example.com");
        userRepo.save(user);

        String token = jwtUtil.generateToken(username);
        Map<String, Object> userInfo = Map.of("id", user.getId(), "username", user.getUsername(),
            "avatar", user.getAvatar() != null ? user.getAvatar() : "");
        return R.ok("登录成功", Map.of("token", token, "user", userInfo));
    }

    @PostMapping("/login")
    public R login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.isBlank()) return R.error("用户名不能为空");
        if (password == null || password.isBlank()) return R.error("密码不能为空");

        var userOpt = userRepo.findByUsername(username);
        if (userOpt.isEmpty()) return R.error("用户名不存在");
        if (!encoder.matches(password, userOpt.get().getPassword())) return R.error("密码错误");

        UserEntity user = userOpt.get();
        String token = jwtUtil.generateToken(username);
        Map<String, Object> userInfo = Map.of("id", user.getId(), "username", user.getUsername(),
            "avatar", user.getAvatar() != null ? user.getAvatar() : "");
        return R.ok("登录成功", Map.of("token", token, "user", userInfo));
    }
}
