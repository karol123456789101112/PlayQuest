package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.GameRating;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.model.Videogame;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameRatingRepository extends JpaRepository<GameRating, Long> {

    Optional<GameRating> findByUserAndVideogame(User user, Videogame videogame);
    List<GameRating> findByVideogame(Videogame videogame);
}
