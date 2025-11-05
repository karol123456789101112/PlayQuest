package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Videogame;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface VideogameRepository extends JpaRepository<Videogame, Long> {
    List<Videogame> findByStockQuantityGreaterThanOrderByRatingDesc(int quantity);
    Optional<Videogame> findByIdAndStockQuantityGreaterThan(Long id, int quantity);

    Page<Videogame> findByStockQuantityGreaterThanOrderByRatingDesc(Long minStock, Pageable pageable);

    Page<Videogame> findByTitleContainingIgnoreCaseAndStockQuantityGreaterThan(String title, long stockQuantity, Pageable pageable);
}
