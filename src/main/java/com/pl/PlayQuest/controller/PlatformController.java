package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.*;
import com.pl.PlayQuest.model.Platform;
import com.pl.PlayQuest.service.PlatformService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/platforms")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PlatformController {

    private final PlatformService platformService;

    @GetMapping
    public ResponseEntity<PageResponse<PlatformViewDto>> getAllPlatforms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                platformService.getAllActive(page, size)
        );
    }

    @GetMapping("/all")
    public List<PlatformViewDto> getAllWithoutPagination() {
        return platformService.getAllActive();
    }

    @PostMapping("/add")
    public ResponseEntity<Platform> addPlatform(
            @Valid @RequestBody PlatformDto platformDto) {

        return ResponseEntity.ok(platformService.add(platformDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatformViewDto> getPlatformById(
            @PathVariable Long id) {

        return ResponseEntity.ok(platformService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Platform> updatePlatform(
            @PathVariable Long id,
            @Valid @RequestBody PlatformDto updatedDto) {

        return ResponseEntity.ok(
                platformService.update(id, updatedDto)
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePlatform(
            @PathVariable Long id) {

        platformService.softDelete(id);
        return ResponseEntity.ok().build();
    }
}

