package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.VideogameCreateDto;
import com.pl.PlayQuest.dto.VideogameDto;
import com.pl.PlayQuest.mapper.VideogameMapper;
import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.model.Platform;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.repo.CategoryRepository;
import com.pl.PlayQuest.repo.PlatformRepository;
import com.pl.PlayQuest.repo.VideogameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/games")
public class VideogameController {
    @Autowired
    private final VideogameRepository videogameRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PlatformRepository platformRepository;

    public VideogameController(VideogameRepository videogameRepository) {
        this.videogameRepository = videogameRepository;
    }

    @GetMapping
    public List<VideogameDto> getAllGames() {
        return videogameRepository.findAllByOrderByRatingDesc()
                .stream()
                .map(VideogameMapper::toDto)
                .toList();
    }

    @PostMapping("add")
    public ResponseEntity<Videogame> addVideogame(@RequestBody VideogameCreateDto dto) {
        Videogame videogame = new Videogame();
        videogame.setTitle(dto.getTitle());
        videogame.setDescription(dto.getDescription());
        videogame.setPrice(dto.getPrice());
        videogame.setReleaseDate(dto.getReleaseDate());
        videogame.setPublisher(dto.getPublisher());
        videogame.setRating(dto.getRating());
        videogame.setStockQuantity(dto.getStockQuantity());
        videogame.setImageUrl(dto.getImageUrl());

        List<Category> categories = categoryRepository.findAllById(dto.getCategoryIds());
        List<Platform> platforms = platformRepository.findAllById(dto.getPlatformIds());

        videogame.setCategories(categories);
        videogame.setPlatforms(platforms);

        Videogame saved = videogameRepository.save(videogame);
        return ResponseEntity.ok(saved);
    }


    @GetMapping("{id}")
    public ResponseEntity<VideogameDto> getGameById(@PathVariable Long id) {
        return videogameRepository.findById(id)
                .map(game -> ResponseEntity.ok(VideogameMapper.toDto(game)))
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("{id}")
    public ResponseEntity<Videogame> updateGame(@PathVariable Long id, @RequestBody VideogameCreateDto dto) {
        return videogameRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(dto.getTitle());
                    existing.setDescription(dto.getDescription());
                    existing.setPrice(dto.getPrice());
                    existing.setReleaseDate(dto.getReleaseDate());
                    existing.setPublisher(dto.getPublisher());
                    existing.setRating(dto.getRating());
                    existing.setStockQuantity(dto.getStockQuantity());
                    existing.setImageUrl(dto.getImageUrl());

                    List<Category> categories = categoryRepository.findAllById(dto.getCategoryIds());
                    List<Platform> platforms = platformRepository.findAllById(dto.getPlatformIds());
                    existing.setCategories(categories);
                    existing.setPlatforms(platforms);

                    return ResponseEntity.ok(videogameRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteGame(@PathVariable Long id) {
        videogameRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

