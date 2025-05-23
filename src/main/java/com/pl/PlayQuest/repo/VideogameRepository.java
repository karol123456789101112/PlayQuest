package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Videogame;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface VideogameRepository extends JpaRepository<Videogame, Long> {
    List<Videogame> findAllByOrderByRatingDesc();
}
