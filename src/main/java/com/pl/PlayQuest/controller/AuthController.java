package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.RegisterUserDto;
import com.pl.PlayQuest.security.JwtUtil;
import com.pl.PlayQuest.service.UserService;
import com.pl.PlayQuest.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserDto dto) {
        User user = userService.registerUser(dto.getEmail(), dto.getPassword(), dto.getFirstName(), dto.getLastName());
        return ResponseEntity.ok(Map.of("message", "Zarejestrowano użytkownika: " + user.getUsername()));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {

        String token = userService.login(
                loginData.get("email"),
                loginData.get("password")
        );

        return ResponseEntity.ok(Map.of("token", token));
    }
}
