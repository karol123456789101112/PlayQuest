package com.pl.PlayQuest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideogameCreateDto {
    private String title;
    private String description;
    private BigDecimal price;
    private LocalDate releaseDate;
    private String publisher;
    private BigDecimal rating;
    private Long stockQuantity;
    private String imageUrl;
    private List<Long> categoryIds;
    private List<Long> platformIds;
}
