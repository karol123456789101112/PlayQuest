package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.GameRecommendationDto;
import com.pl.PlayQuest.dto.VideogameDto;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.repo.VideogameRepository;
import com.pl.PlayQuest.mapper.VideogameMapper;
import com.pl.PlayQuest.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final VideogameRepository videogameRepository;
    private final JwtUtil jwtUtil;

    public List<GameRecommendationDto> getRecommendationsForLoggedUser(
            String authHeader,
            int limit) {

        String token = authHeader.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(token);

        return videogameRepository
                .findRecommendedGames(userId, PageRequest.of(0, limit))
                .stream()
                .map(this::toRecommendationDto)
                .toList();
    }

    public List<GameRecommendationDto> getTopGamesForGuest(int limit) {
        return videogameRepository
                .findTopSellingGames(PageRequest.of(0, limit))
                .stream()
                .map(this::toRecommendationDto)
                .toList();
    }

    public List<VideogameDto> getByCategory(String category) {
        return videogameRepository.findByCategory(category)
                .stream()
                .map(VideogameMapper::toDto)
                .toList();
    }

    private GameRecommendationDto toRecommendationDto(Videogame v) {
        return new GameRecommendationDto(
                v.getId(),
                v.getTitle(),
                v.getImageUrl(),
                v.getRating()
        );
    }
}

