package com.pl.PlayQuest.service;

import com.pl.PlayQuest.repo.StatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final StatsRepository statsRepository;

    public List<Map<String, Object>> getTopSellingGames() {
        return statsRepository.findTopSellingGames();
    }

    public List<Map<String, Object>> getTopSellingCategories() {
        return statsRepository.findTopSellingCategories();
    }

    public List<Map<String, Object>> getMonthlySales() {
        return statsRepository.findMonthlySales();
    }

    public Map<String, Object> getAverageGamePrice() {
        return statsRepository.findAverageGamePrice();
    }
}

