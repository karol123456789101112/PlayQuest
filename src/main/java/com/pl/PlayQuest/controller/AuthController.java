package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.security.JwtUtil;
import com.pl.PlayQuest.service.UserService;
import com.pl.PlayQuest.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.*;
import java.util.Optional;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;
    private final JwtUtil jwtUtil;
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam(required = false) MultipartFile profileImage
    ) {
        logger.info("Odebrano rejestrację: {}", email);

        if (profileImage != null) {
            logger.info("Załączono plik: {}", profileImage.getOriginalFilename());
        }

        User user = userService.registerUser(email, password, firstName, lastName);

        return ResponseEntity.ok(Map.of("message", "Zarejestrowano użytkownika: " + user.getUsername()));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        boolean isAuthenticated = userService.authenticateUser(email, password);

        if (isAuthenticated) {
            User user;
            Optional<User> optionalUser = userService.findByUsername(email);

            if (optionalUser.isPresent()) {
                user = optionalUser.get();
            } else {
                return ResponseEntity.status(401).body("Nieprawidłowy email lub hasło.");
            }

            String token = jwtUtil.generateToken(user);

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Błędny email lub hasło.");
        }
    }

}
