package com.pl.PlayQuest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameRecommendationDto {
    private Long id;
    private String title;
    private String imageUrl;
    private BigDecimal rating;
}
