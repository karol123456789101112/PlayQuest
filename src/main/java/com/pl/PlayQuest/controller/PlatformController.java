package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.CategoryDto;
import com.pl.PlayQuest.dto.CategoryViewDto;
import com.pl.PlayQuest.dto.PlatformDto;
import com.pl.PlayQuest.dto.PlatformViewDto;
import com.pl.PlayQuest.mapper.CategoryMapper;
import com.pl.PlayQuest.mapper.PlatformMapper;
import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.model.Platform;
import com.pl.PlayQuest.repo.PlatformRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/platforms")
public class PlatformController {


    @Autowired
    private final PlatformRepository platformRepository;

    public PlatformController(PlatformRepository platformRepository) {
        this.platformRepository = platformRepository;
    }

    @GetMapping
    public List<PlatformViewDto> getAllPlatforms() {
        return platformRepository.findByActiveTrue()
                .stream()
                .map(PlatformMapper::toViewDto)
                .toList();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPlatform(@Valid @RequestBody PlatformDto platformDto) {
        Platform saved = platformRepository.save(PlatformMapper.toEntity(platformDto));
        return ResponseEntity.ok(saved);
    }

    @GetMapping("{id}")
    public ResponseEntity<PlatformViewDto> getPlatformById(@PathVariable Long id) {
        return platformRepository.findById(id)
                .map(PlatformMapper::toViewDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePlatform(@PathVariable Long id, @Valid @RequestBody PlatformDto updatedDto) {
        return platformRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedDto.getName());
                    return ResponseEntity.ok(platformRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Platform platform = platformRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        platform.setActive(false);
        platformRepository.save(platform);

        return ResponseEntity.ok().build();
    }

}
