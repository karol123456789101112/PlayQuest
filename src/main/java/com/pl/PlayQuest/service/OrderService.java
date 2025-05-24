package com.pl.PlayQuest.service;

import com.pl.PlayQuest.exception.EmptyCartException;
import com.pl.PlayQuest.model.*;
import com.pl.PlayQuest.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
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
                .orElseThrow(() -> new RuntimeException("User has not been found"));

        ContactAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address has not been found"));

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new EmptyCartException("The Cart is empty");
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
        order.setStatus(OrderStatus.PENDING);
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
    public List<Order> getOrdersWithUpdatedStatuses(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        LocalDateTime now = LocalDateTime.now();

        for (Order order : orders) {
            Duration duration = Duration.between(order.getOrderDate(), now);

            if (duration.toMinutes() >= 2 && order.getStatus() != OrderStatus.DELIVERED) {
                order.setStatus(OrderStatus.DELIVERED);
                orderRepository.save(order);
            } else if (duration.toMinutes() >= 1 && order.getStatus() == OrderStatus.PENDING) {
                order.setStatus(OrderStatus.SENT);
                orderRepository.save(order);
            }
        }

        return orders;
    }

}


