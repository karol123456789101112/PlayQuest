package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.PageResponse;
import com.pl.PlayQuest.dto.VideogameCreateDto;
import com.pl.PlayQuest.dto.VideogameDto;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.service.VideogameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class VideogameController {

    private final VideogameService videogameService;

    @GetMapping
    public ResponseEntity<PageResponse<VideogameDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(videogameService.getAll(page, size));
    }

    @GetMapping("/all")
    public ResponseEntity<List<VideogameDto>> getAllWithoutPagination() {
        return ResponseEntity.ok(videogameService.getAllWithoutPagination());
    }

    @GetMapping("/limited")
    public ResponseEntity<List<VideogameDto>> getLimited(@RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(videogameService.getLimited(limit));
    }

    @PostMapping("/add")
    public ResponseEntity<Videogame> add(@Valid @RequestBody VideogameCreateDto dto) {
        return ResponseEntity.ok(videogameService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideogameDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(videogameService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Videogame> update(@PathVariable Long id, @Valid @RequestBody VideogameCreateDto dto) {
        return ResponseEntity.ok(videogameService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        videogameService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<VideogameDto>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(videogameService.search(query, page, size));
    }

    @GetMapping("/compare")
    public ResponseEntity<List<VideogameDto>> compare(
            @RequestParam Long firstId,
            @RequestParam Long secondId
    ) {
        return ResponseEntity.ok(videogameService.compare(firstId, secondId));
    }

    @GetMapping("/filter")
    public ResponseEntity<PageResponse<VideogameDto>> filter(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> platforms,
            @RequestParam(required = false, defaultValue = "") String search
    ) {
        return ResponseEntity.ok(videogameService.filter(page, size, categories, platforms, search));
    }
}
