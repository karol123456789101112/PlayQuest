package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.GameRecommendationDto;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.repo.VideogameRepository;
import com.pl.PlayQuest.service.RecommendationService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.pl.PlayQuest.security.JwtUtil;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final VideogameRepository videogameRepository;
    private final JwtUtil jwtUtil;

    public RecommendationController(RecommendationService recommendationService, JwtUtil jwtUtil,
                                    VideogameRepository videogameRepository) {
        this.recommendationService = recommendationService;
        this.jwtUtil = jwtUtil;
        this.videogameRepository = videogameRepository;
    }

    @GetMapping("/logged")
    public List<GameRecommendationDto> getRecommendations(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(token);
        return recommendationService.getRecommendationsForUser(userId, 8);
    }

    @GetMapping("/all")
    public ResponseEntity<List<GameRecommendationDto>> getTopGamesForGuest() {
        List<Videogame> topGames = videogameRepository.findTopSellingGames(PageRequest.of(0, 8));

        List<GameRecommendationDto> dtos = topGames.stream()
                .map(v -> new GameRecommendationDto(
                        v.getId(),
                        v.getTitle(),
                        v.getImageUrl(),
                        v.getRating()
                ))
                .toList();

        return ResponseEntity.ok(dtos);
    }

}