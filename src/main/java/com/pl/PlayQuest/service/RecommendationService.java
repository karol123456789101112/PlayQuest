package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.GameRecommendationDto;
import com.pl.PlayQuest.dto.VideogameDto;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.repo.VideogameRepository;
import com.pl.PlayQuest.mapper.VideogameMapper;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class RecommendationService {

    private final VideogameRepository videogameRepository;

    public RecommendationService(VideogameRepository videogameRepository) {
        this.videogameRepository = videogameRepository;
    }

    public List<GameRecommendationDto> getRecommendationsForUser(Long userId, int limit) {
        List<Videogame> games = videogameRepository.findRecommendedGames(userId, PageRequest.of(0, limit));
        return games.stream()
                .map(v -> {
                    GameRecommendationDto dto = new GameRecommendationDto();
                    dto.setId(v.getId());
                    dto.setTitle(v.getTitle());
                    dto.setImageUrl(v.getImageUrl());
                    dto.setRating(v.getRating());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<VideogameDto> getByCategory(String category) {
        return videogameRepository.findByCategory(category)
                .stream()
                .map(VideogameMapper::toDto)
                .toList();
    }
}
