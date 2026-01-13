package com.pl.PlayQuest.service;

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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VideogameService {

    private final VideogameRepository videogameRepository;
    private final CategoryRepository categoryRepository;
    private final PlatformRepository platformRepository;
    public PageResponse<VideogameDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Videogame> gamePage = videogameRepository.findByStockQuantityGreaterThanOrderByRatingDesc(0L, pageable);

        List<VideogameDto> content = gamePage.getContent().stream()
                .map(VideogameMapper::toDto)
                .toList();

        return new PageResponse<>(
                content,
                gamePage.getTotalPages(),
                gamePage.getTotalElements(),
                gamePage.getNumber(),
                gamePage.getSize()
        );
    }

    public List<VideogameDto> getAllWithoutPagination() {
        return videogameRepository.findByStockQuantityGreaterThanOrderByRatingDesc(0)
                .stream()
                .map(VideogameMapper::toDto)
                .toList();
    }

    public List<VideogameDto> getLimited(int limit) {
        return videogameRepository.findByStockQuantityGreaterThanOrderByRatingDesc(0)
                .stream()
                .limit(limit)
                .map(VideogameMapper::toDto)
                .toList();
    }
    public Videogame create(VideogameCreateDto dto) {
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

        return videogameRepository.save(videogame);
    }
    public Videogame update(Long id, VideogameCreateDto dto) {
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

                    return videogameRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }
    public void delete(Long id) {
        Videogame game = videogameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        game.setStockQuantity(0L);
        videogameRepository.save(game);
    }
    public PageResponse<VideogameDto> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Videogame> gamePage = videogameRepository.findByTitleContainingIgnoreCaseAndStockQuantityGreaterThan(
                query, 0L, pageable
        );

        List<VideogameDto> content = gamePage.getContent().stream()
                .map(VideogameMapper::toDto)
                .toList();

        return new PageResponse<>(
                content,
                gamePage.getTotalPages(),
                gamePage.getTotalElements(),
                gamePage.getNumber(),
                gamePage.getSize()
        );
    }
    public List<VideogameDto> compare(Long firstId, Long secondId) {
        return videogameRepository.findAllById(List.of(firstId, secondId))
                .stream()
                .filter(g -> g.getStockQuantity() > 0)
                .map(VideogameMapper::toDto)
                .toList();
    }

    public PageResponse<VideogameDto> filter(int page, int size, List<String> categories, List<String> platforms, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Videogame> gamePage = videogameRepository.filterGames(
                search.toLowerCase(),
                categories,
                platforms,
                pageable
        );

        List<VideogameDto> content = gamePage.getContent().stream()
                .map(VideogameMapper::toDto)
                .toList();

        return new PageResponse<>(
                content,
                gamePage.getTotalPages(),
                gamePage.getTotalElements(),
                gamePage.getNumber(),
                gamePage.getSize()
        );
    }

    public VideogameDto getById(Long id) {
        return videogameRepository.findByIdAndStockQuantityGreaterThan(id, 0)
                .map(VideogameMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }
}
