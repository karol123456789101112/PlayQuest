package com.pl.PlayQuest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "game_ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "videogame_id")
    private Videogame videogame;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private int rating;

    public GameRating(User user, Videogame videogame, int rating) {
        this.user = user;
        this.videogame = videogame;
        this.rating = rating;
    }
}
