package com.pl.PlayQuest.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.model.Platform;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "videogame")
public class Videogame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(mappedBy = "videogames")
    @JsonIgnore
    private List<Category> categories;

    @ManyToMany(mappedBy = "videogames")
    @JsonIgnore
    private List<Platform> platforms;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private LocalDate releaseDate;

    @Column(nullable = false)
    private String publisher;

    @Column(nullable = false)
    private BigDecimal rating;

    @Column(nullable = false)
    private Long stockQuantity;

    @Column(nullable = false)
    private String imageUrl;
}