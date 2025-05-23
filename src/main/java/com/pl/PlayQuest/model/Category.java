package com.pl.PlayQuest.model;

import jakarta.persistence.*;
import lombok.*;
import com.pl.PlayQuest.model.Videogame;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "category")
public class Category {
    public Category(Long id, String name) {
        this.id = id;
        this.name = name;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "videogame_category",
            joinColumns = @JoinColumn(name = "category_id"),
            inverseJoinColumns = @JoinColumn(name = "video_game_id")
    )
    private List<Videogame> videogames;

    @Column(nullable = false)
    private String name;

    private String imageUrl;
}