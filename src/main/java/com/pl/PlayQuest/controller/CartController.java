package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.model.Cart;
import com.pl.PlayQuest.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public List<Cart> getCart(@RequestParam Long userId) {
        return cartService.getCartByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Void> addToCart(@RequestParam Long userId, @RequestParam Long gameId) {
        cartService.addToCart(userId, gameId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFromCart(@RequestParam Long userId, @RequestParam Long gameId) {
        cartService.removeFromCart(userId, gameId);
        return ResponseEntity.noContent().build();
    }
}
