package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Videogame;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface VideogameRepository extends JpaRepository<Videogame, Long> {
    List<Videogame> findByStockQuantityGreaterThanOrderByRatingDesc(int quantity);
    Optional<Videogame> findByIdAndStockQuantityGreaterThan(Long id, int quantity);

    Page<Videogame> findByStockQuantityGreaterThanOrderByRatingDesc(Long minStock, Pageable pageable);

    Page<Videogame> findByTitleContainingIgnoreCaseAndStockQuantityGreaterThan(String title, long stockQuantity, Pageable pageable);

    @Query("""
        SELECT DISTINCT v
        FROM Videogame v
        WHERE EXISTS (
            SELECT 1 FROM v.categories c
            WHERE LOWER(c.name) = LOWER(:category)
        )
    """)
    List<Videogame> findByCategory(@Param("category") String category);
    @Query("""
        SELECT DISTINCT v FROM Videogame v
        JOIN v.categories c2
        WHERE v.id NOT IN (
            SELECT oi.videogame.id FROM OrderItem oi WHERE oi.order.user.id = :userId
        )
        AND c2 IN (
            SELECT c FROM Videogame vg 
            JOIN vg.categories c
            JOIN OrderItem oi ON oi.videogame = vg
            WHERE oi.order.user.id = :userId
        )
        ORDER BY v.rating DESC
    """)
    List<Videogame> findRecommendedGames(@Param("userId") Long userId, Pageable pageable);

    @Query("""
        SELECT v 
        FROM Videogame v
        JOIN OrderItem oi ON oi.videogame = v
        GROUP BY v
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<Videogame> findTopSellingGames(Pageable pageable);

    @Query("""
        SELECT g FROM Videogame g
        WHERE g.stockQuantity > 0
          AND (:search IS NULL OR LOWER(g.title) LIKE %:search%)
          AND (:categories IS NULL OR EXISTS (
                SELECT c FROM g.categories c WHERE c.name IN :categories
          ))
          AND (:platforms IS NULL OR EXISTS (
                SELECT p FROM g.platforms p WHERE p.name IN :platforms
          ))
        ORDER BY g.rating DESC
    """)
    Page<Videogame> filterGames(
            @Param("search") String search,
            @Param("categories") List<String> categories,
            @Param("platforms") List<String> platforms,
            Pageable pageable
    );

}
