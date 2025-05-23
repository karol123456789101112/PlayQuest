package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
    boolean existsByUserIdAndVideogameId(Long userId, Long videogameId);
    Cart findByUserIdAndVideogameId(Long userId, Long videogameId);
}

