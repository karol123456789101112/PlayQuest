package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.PageResponse;
import com.pl.PlayQuest.dto.VideogameCreateDto;
import com.pl.PlayQuest.dto.VideogameDto;
import com.pl.PlayQuest.mapper.VideogameMapper;
import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.model.Platform;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.repo.CategoryRepository;
import com.pl.PlayQuest.repo.PlatformRepository;
import com.pl.PlayQuest.repo.VideogameRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<PageResponse<VideogameDto>> getAllGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Videogame> gamePage = videogameRepository.findByStockQuantityGreaterThanOrderByRatingDesc(0L, pageable);

        List<VideogameDto> content = gamePage.getContent().stream()
                .map(VideogameMapper::toDto)
                .toList();

        PageResponse<VideogameDto> response = new PageResponse<>(
                content,
                gamePage.getTotalPages(),
                gamePage.getTotalElements(),
                gamePage.getNumber(),
                gamePage.getSize()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<VideogameDto>> getAllWithoutPagination() {
        List<VideogameDto> all = videogameRepository.findByStockQuantityGreaterThanOrderByRatingDesc(0)
                .stream()
                .map(VideogameMapper::toDto)
                .toList();

        return ResponseEntity.ok(all);
    }

    @GetMapping("/limited")
    public ResponseEntity<List<VideogameDto>> getLimited(@RequestParam(defaultValue = "20") int limit) {
        List<VideogameDto> limited = videogameRepository
                .findByStockQuantityGreaterThanOrderByRatingDesc(0)
                .stream()
                .limit(limit)
                .map(VideogameMapper::toDto)
                .toList();

        return ResponseEntity.ok(limited);
    }


    @PostMapping("add")
    public ResponseEntity<Videogame> addVideogame(@Valid @RequestBody VideogameCreateDto dto) {
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
        return videogameRepository.findByIdAndStockQuantityGreaterThan(id, 0)
                .map(game -> ResponseEntity.ok(VideogameMapper.toDto(game)))
                .orElse(ResponseEntity.notFound().build());
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<Videogame> updateGame(@PathVariable Long id, @Valid @RequestBody VideogameCreateDto dto) {
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


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteGame(@PathVariable Long id) {
        Videogame game = videogameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        game.setStockQuantity(0L);
        videogameRepository.save(game);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<VideogameDto>> searchGames(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Videogame> gamePage = videogameRepository.findByTitleContainingIgnoreCaseAndStockQuantityGreaterThan(
                query, 0L, pageable
        );

        List<VideogameDto> content = gamePage.getContent().stream()
                .map(VideogameMapper::toDto)
                .toList();

        PageResponse<VideogameDto> response = new PageResponse<>(
                content,
                gamePage.getTotalPages(),
                gamePage.getTotalElements(),
                gamePage.getNumber(),
                gamePage.getSize()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/compare")
    public ResponseEntity<List<VideogameDto>> compareGames(
            @RequestParam Long firstId,
            @RequestParam Long secondId
    ) {
        List<VideogameDto> result = videogameRepository
                .findAllById(List.of(firstId, secondId))
                .stream()
                .filter(g -> g.getStockQuantity() > 0)
                .map(VideogameMapper::toDto)
                .toList();

        return ResponseEntity.ok(result);
    }

}

