package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.OrderDto;
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
    @Autowired
    private VideogameRepository videogameRepository;

    @Autowired
    private UserPaymentRepository userPaymentRepository;

    public Order createOrder(Long userId, Long addressId) {
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
        orderRepository.save(order);

        // Utwórz OrderItemy
        for (Cart cartItem : cartItems) {
            Videogame game = cartItem.getVideogame();
            Long orderedQuantity = cartItem.getQuantity();

            // Sprawdź, czy wystarczająca ilość gier jest na stanie
            if (game.getStockQuantity() < orderedQuantity) {
                throw new RuntimeException("Not enough stock for game: " + game.getTitle());
            }

            // Zmniejsz ilość na stanie
            game.setStockQuantity(game.getStockQuantity() - orderedQuantity);
            videogameRepository.save(game); // <-- zapis do bazy

            // Utwórz OrderItem
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setVideogame(game);
            item.setGamePrice(game.getPrice());
            item.setQuantity(orderedQuantity);
            orderItemRepository.save(item);
        }

        // Wyczyść koszyk
        cartRepository.deleteAll(cartItems);

        return order;
    }
    public List<OrderDto> getOrdersWithUpdatedStatuses(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        LocalDateTime now = LocalDateTime.now();
        List<OrderDto> dtos = new ArrayList<>();

        for (Order order : orders) {
            UserPayment payment = userPaymentRepository
                    .findTopByOrderIdOrderByIdDesc(order.getId())
                    .orElse(null);

            if (payment != null && payment.getStatus() == PaymentStatus.SUCCEEDED) {
                LocalDateTime paidAt = payment.getPaidAt();
                Duration duration = Duration.between(paidAt, now);

                if (duration.toMinutes() >= 2 && order.getStatus() != OrderStatus.DELIVERED) {
                    order.setStatus(OrderStatus.DELIVERED);
                    orderRepository.save(order);
                } else if (duration.toMinutes() >= 1 && order.getStatus() == OrderStatus.PENDING) {
                    order.setStatus(OrderStatus.SENT);
                    orderRepository.save(order);
                }
            }

            OrderDto dto = new OrderDto();
            dto.setId(order.getId());
            dto.setOrderDate(order.getOrderDate());
            dto.setStatus(order.getStatus());
            dto.setPaymentStatus(payment != null ? payment.getStatus() : null);

            dtos.add(dto);
        }

        return dtos;
    }

}


