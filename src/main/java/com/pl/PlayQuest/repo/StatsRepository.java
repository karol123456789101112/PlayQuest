package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
@Repository
public interface StatsRepository extends JpaRepository<OrderItem, Long> {
    @Query("""
        SELECT new map(v.title as title, SUM(oi.quantity) as totalSold)
        FROM OrderItem oi
        JOIN oi.videogame v
        GROUP BY v.id, v.title
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<Map<String, Object>> findTopSellingGames();

    @Query("""
        SELECT new map(c.name as category, SUM(oi.quantity) as totalSold)
        FROM OrderItem oi
        JOIN oi.videogame v
        JOIN v.categories c
        GROUP BY c.name
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<Map<String, Object>> findTopSellingCategories();

    @Query("""
        SELECT new map(
            FUNCTION('TO_CHAR', o.orderDate, 'YYYY-MM') as month,
            SUM(oi.quantity) as totalSold
        )
        FROM OrderItem oi
        JOIN oi.order o
        GROUP BY FUNCTION('TO_CHAR', o.orderDate, 'YYYY-MM')
        ORDER BY FUNCTION('TO_CHAR', o.orderDate, 'YYYY-MM')
    """)
    List<Map<String, Object>> findMonthlySales();

    @Query("""
        SELECT new map(
            AVG(oi.gamePrice) as averagePrice
        )
        FROM OrderItem oi
    """)
    Map<String, Object> findAverageGamePrice();
}
