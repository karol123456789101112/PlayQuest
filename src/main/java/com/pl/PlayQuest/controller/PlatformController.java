package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.model.Platform;
import com.pl.PlayQuest.repo.PlatformRepository;
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
    public List<Platform> getAllPlatforms() {
        return platformRepository.findAll();
    }

    @PostMapping("add")
    public ResponseEntity<Platform> addPlatform(@RequestBody Platform platform) {
        Platform saved = platformRepository.save(platform);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("{id}")
    public ResponseEntity<Platform> getPlatformById(@PathVariable Long id) {
        return platformRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("{id}")
    public ResponseEntity<Platform> updatePlatform(@PathVariable Long id, @RequestBody Platform updatedPlatform) {
        return platformRepository.findById(id)
                .map(existing -> {
                    updatedPlatform.setId(id);
                    return ResponseEntity.ok(platformRepository.save(updatedPlatform));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("{id}")
    public ResponseEntity<?> deletePlatform(@PathVariable Long id) {
        platformRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
