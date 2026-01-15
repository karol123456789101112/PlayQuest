package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.GameRatingDto;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.repo.UserRepository;
import com.pl.PlayQuest.security.JwtUtil;
import com.pl.PlayQuest.service.GameRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/gameRating")
@RequiredArgsConstructor
public class GameRatingController {
    private final GameRatingService gameRatingService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    @PostMapping("/{id}/add")
    public ResponseEntity<?> rateGame(
            @PathVariable Long id,
            @RequestBody GameRatingDto dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        gameRatingService.rate(id, dto, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/getRating")
    public ResponseEntity<GameRatingDto> getRating(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ){
        String token = authHeader.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(gameRatingService.getRatingForUser(id, user));
    }

    @GetMapping("/{id}/averageRating")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable Long id) {
        double avg = gameRatingService.getAverageRatingForGame(id);
        return ResponseEntity.ok(Map.of("averageRating", avg));
    }
}
