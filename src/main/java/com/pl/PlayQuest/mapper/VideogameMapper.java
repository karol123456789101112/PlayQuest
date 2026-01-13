package com.pl.PlayQuest.mapper;


import com.pl.PlayQuest.dto.VideogameCreateDto;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.dto.VideogameDto;
import com.pl.PlayQuest.dto.GameRecommendationDto;
import java.util.stream.Collectors;

public class VideogameMapper {

    public static VideogameDto toDto(Videogame videogame) {
        VideogameDto dto = new VideogameDto();
        dto.setId(videogame.getId());
        dto.setTitle(videogame.getTitle());
        dto.setDescription(videogame.getDescription());
        dto.setPrice(videogame.getPrice());
        dto.setReleaseDate(videogame.getReleaseDate());
        dto.setPublisher(videogame.getPublisher());
        dto.setRating(videogame.getRating());
        dto.setStockQuantity(videogame.getStockQuantity());
        dto.setImageUrl(videogame.getImageUrl());

        dto.setCategories(
                videogame.getCategories().stream()
                        .map(category -> category.getName())
                        .collect(Collectors.toList())
        );

        dto.setPlatforms(
                videogame.getPlatforms().stream()
                        .map(platform -> platform.getName())
                        .collect(Collectors.toList())
        );

        return dto;
    }

    public static GameRecommendationDto toRecommendationDto(Videogame game) {
        return new GameRecommendationDto(
                game.getId(),
                game.getTitle(),
                game.getImageUrl(),
                game.getRating()
        );
    }
    public static Videogame fromCreateDto(VideogameCreateDto dto) {
        Videogame v = new Videogame();
        v.setTitle(dto.getTitle());
        v.setDescription(dto.getDescription());
        v.setPrice(dto.getPrice());
        v.setReleaseDate(dto.getReleaseDate());
        v.setPublisher(dto.getPublisher());
        v.setRating(dto.getRating());
        v.setStockQuantity(dto.getStockQuantity());
        v.setImageUrl(dto.getImageUrl());
        return v;
    }

    public static void update(Videogame v, VideogameCreateDto dto) {
        v.setTitle(dto.getTitle());
        v.setDescription(dto.getDescription());
        v.setPrice(dto.getPrice());
        v.setReleaseDate(dto.getReleaseDate());
        v.setPublisher(dto.getPublisher());
        v.setRating(dto.getRating());
        v.setStockQuantity(dto.getStockQuantity());
        v.setImageUrl(dto.getImageUrl());
    }
}

