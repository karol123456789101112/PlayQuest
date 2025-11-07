package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.repo.StatsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/stats")
public class StatsController {

    private final StatsRepository statsRepository;

    public StatsController(StatsRepository statsRepository) {
        this.statsRepository = statsRepository;
    }

    @GetMapping("/top-games")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingGames() {
        return ResponseEntity.ok(statsRepository.findTopSellingGames());
    }

    @GetMapping("/top-categories")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingCategories() {
        List<Map<String, Object>> stats = statsRepository.findTopSellingCategories();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/monthly-sales")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySales() {
        List<Map<String, Object>> stats = statsRepository.findMonthlySales();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/average-price")
    public ResponseEntity<Map<String, Object>> getAveragePrice() {
        Map<String, Object> avg = statsRepository.findAverageGamePrice();
        return ResponseEntity.ok(avg);
    }

}
