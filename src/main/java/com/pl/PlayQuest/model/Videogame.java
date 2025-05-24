package com.pl.PlayQuest.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.model.Platform;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "videogame")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Videogame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "videogame_category",
            joinColumns = @JoinColumn(name = "video_game_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;

    @ManyToMany
    @JoinTable(
            name = "videogame_platform",
            joinColumns = @JoinColumn(name = "video_game_id"),
            inverseJoinColumns = @JoinColumn(name = "platform_id")
    )
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
