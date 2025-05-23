package com.pl.PlayQuest.service;

import com.pl.PlayQuest.model.Cart;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.model.Videogame;
import com.pl.PlayQuest.repo.CartRepository;
import com.pl.PlayQuest.repo.UserRepository;
import com.pl.PlayQuest.repo.VideogameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideogameRepository videogameRepository;

    public List<Cart> getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public void addToCart(Long userId, Long gameId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Videogame game = videogameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (cartRepository.existsByUserIdAndVideogameId(userId, gameId)) {
            Cart cart = cartRepository.findByUserIdAndVideogameId(userId, gameId);
            cart.setQuantity(cart.getQuantity() + 1);
            cartRepository.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setVideogame(game);
            cart.setQuantity(1L);
            cartRepository.save(cart);
        }
    }

    public void removeFromCart(Long userId, Long gameId) {
        Cart cart = cartRepository.findByUserIdAndVideogameId(userId, gameId);
        cartRepository.delete(cart);
    }
}
