package com.pl.PlayQuest.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideogameCreateDto {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be at most 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "10000.0", message = "Price must be at most 10000.0")
    private BigDecimal price;

    @NotNull(message = "Release date is required")
    private LocalDate releaseDate;

    @NotBlank(message = "Publisher is required")
    @Size(max = 80, message = "Publisher name must be at most 80 characters")
    private String publisher;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Rating must be at most 10.0")
    private BigDecimal rating;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Max(value = 10000, message = "Stock quantity must be at most 10000")
    private Long stockQuantity;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Category IDs are required")
    @Size(min = 1, message = "At least one category must be selected")
    private List<Long> categoryIds;

    @NotNull(message = "Platform IDs are required")
    @Size(min = 1, message = "At least one platform must be selected")
    private List<Long> platformIds;
}
