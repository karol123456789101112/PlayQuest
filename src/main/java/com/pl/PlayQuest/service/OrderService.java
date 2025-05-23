package com.pl.PlayQuest.service;

import com.pl.PlayQuest.exception.EmptyCartException;
import com.pl.PlayQuest.model.*;
import com.pl.PlayQuest.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactAddressRepository addressRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public void createOrder(Long userId, Long addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        ContactAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono adresu"));

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new EmptyCartException("Koszyk jest pusty");
        }

        // Oblicz całkowitą kwotę
        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getVideogame().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Utwórz nowe zamówienie
        Order order = new Order();
        order.setUser(user);
        order.setContactAddress(address);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        orderRepository.save(order); // zapisz najpierw, żeby mieć ID

        // Utwórz OrderItemy
        for (Cart cartItem : cartItems) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setVideogame(cartItem.getVideogame());
            item.setGamePrice(cartItem.getVideogame().getPrice());
            item.setQuantity(cartItem.getQuantity());
            orderItemRepository.save(item);
        }

        // Wyczyść koszyk
        cartRepository.deleteAll(cartItems);
    }
}


