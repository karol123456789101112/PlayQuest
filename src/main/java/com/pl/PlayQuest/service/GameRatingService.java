package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.GameRatingDto;
import com.pl.PlayQuest.model.GameRating;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.repo.GameRatingRepository;
import com.pl.PlayQuest.repo.VideogameRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameRatingService {

    private final VideogameRepository videogameRepository;
    private final GameRatingRepository gameRatingRepository;
    @Transactional
    public void rate(Long gameId, GameRatingDto dto, User user){
        Videogame game = videogameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        GameRating rating = gameRatingRepository.findByUserAndVideogame(user, game)
                .orElse(new GameRating(user, game, dto.getRating()));

        rating.setRating(dto.getRating());
        gameRatingRepository.save(rating);

        Double avg = gameRatingRepository.findByVideogame(game)
                .stream()
                .mapToInt(GameRating::getRating)
                .average()
                .orElse(0);

        game.setUserRating(avg);
        videogameRepository.save(game);
    }

    public GameRatingDto getRatingForUser(Long gameId, User user) {
        Videogame game = videogameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        Optional<GameRating> ratingOpt = gameRatingRepository.findByUserAndVideogame(user, game);

        return ratingOpt
                .map(r -> new GameRatingDto(r.getId(), r.getRating()))
                .orElse(new GameRatingDto(null, 0));
    }

    public double getAverageRatingForGame(Long gameId){
        Videogame videogame = videogameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        return videogame.getUserRating();
    }
}