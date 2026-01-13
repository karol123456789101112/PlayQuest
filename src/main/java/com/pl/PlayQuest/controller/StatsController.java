package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.repo.StatsRepository;
import com.pl.PlayQuest.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stats")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/top-games")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingGames() {
        return ResponseEntity.ok(statsService.getTopSellingGames());
    }

    @GetMapping("/top-categories")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingCategories() {
        return ResponseEntity.ok(statsService.getTopSellingCategories());
    }

    @GetMapping("/monthly-sales")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySales() {
        return ResponseEntity.ok(statsService.getMonthlySales());
    }

    @GetMapping("/average-price")
    public ResponseEntity<Map<String, Object>> getAveragePrice() {
        return ResponseEntity.ok(statsService.getAverageGamePrice());
    }
}

