package com.pl.PlayQuest.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "platform")
public class Platform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "videogame_platform",
            joinColumns = @JoinColumn(name = "platform_id"),
            inverseJoinColumns = @JoinColumn(name = "video_game_id")
    )
    private List<Videogame> videogames;

    @Column(nullable = false)
    private String name;

    private String imageUrl;
}