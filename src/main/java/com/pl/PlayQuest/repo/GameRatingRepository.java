package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Expense;
import com.pl.PlayQuest.model.GameRating;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.model.Videogame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GameRatingRepository extends JpaRepository<GameRating, Long> {

    Optional<GameRating> findByUserAndVideogame(User user, Videogame videogame);
    List<GameRating> findByVideogame(Videogame videogame);
    @Query("""
       SELECT AVG(r.rating)
       FROM GameRating r
       WHERE r.videogame.id = :gameId
    """)
    Double getAverageRating(Long gameId);

    @Query("""
       SELECT COUNT(r)
       FROM GameRating r
       WHERE r.videogame.id = :gameId
    """)
    Long getRatingCount(Long gameId);

}
