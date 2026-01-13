package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.GameRecommendationDto;
import com.pl.PlayQuest.dto.VideogameDto;
import com.pl.PlayQuest.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/logged")
    public List<GameRecommendationDto> getRecommendationsForLoggedUser(
            @RequestHeader("Authorization") String authHeader) {

        return recommendationService.getRecommendationsForLoggedUser(authHeader, 8);
    }

    @GetMapping("/all")
    public ResponseEntity<List<GameRecommendationDto>> getTopGamesForGuest() {
        return ResponseEntity.ok(
                recommendationService.getTopGamesForGuest(8)
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<VideogameDto>> getByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                recommendationService.getByCategory(category)
        );
    }
}
