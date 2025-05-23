package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.VideogameDto;
import com.pl.PlayQuest.mapper.VideogameMapper;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.repo.VideogameRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/games")
public class VideogameController {

    private final VideogameRepository videogameRepository;

    public VideogameController(VideogameRepository videogameRepository) {
        this.videogameRepository = videogameRepository;
    }

    @GetMapping
    public List<Videogame> getTopRatedGames() {
        return videogameRepository.findAllByOrderByRatingDesc();
    }

    @PostMapping("add")
    public ResponseEntity<Videogame> addVideogame(@RequestBody Videogame videogame) {
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
    public ResponseEntity<Videogame> updateGame(@PathVariable Long id, @RequestBody Videogame updatedGame) {
        return videogameRepository.findById(id)
                .map(existing -> {
                    updatedGame.setId(id);
                    return ResponseEntity.ok(videogameRepository.save(updatedGame));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteGame(@PathVariable Long id) {
        videogameRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

