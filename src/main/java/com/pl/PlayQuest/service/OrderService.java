package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.OrderDetailsDto;
import com.pl.PlayQuest.dto.OrderDto;
import com.pl.PlayQuest.exception.EmptyCartException;
import com.pl.PlayQuest.exception.NotFoundException;
import com.pl.PlayQuest.model.*;
import com.pl.PlayQuest.repo.*;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final ContactAddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final VideogameRepository videogameRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final UserPaymentRepository userPaymentRepository;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        UserPaymentRepository userPaymentRepository,
                        ContactAddressRepository addressRepository,
                        CartRepository cartRepository,
                        VideogameRepository videogameRepository,
                        OrderItemRepository orderItemRepository) {
        this.addressRepository = addressRepository;
        this.cartRepository = cartRepository;
        this.videogameRepository = videogameRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.userPaymentRepository = userPaymentRepository;
    }


    public Order createOrder(Long userId, Long addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User has not been found"));

        ContactAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address has not been found"));

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new EmptyCartException("The Cart is empty");
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getVideogame().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setUser(user);
        order.setContactAddress(address);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);
        orderRepository.save(order);

        for (Cart cartItem : cartItems) {
            Videogame game = cartItem.getVideogame();
            Long orderedQuantity = cartItem.getQuantity();

            if (game.getStockQuantity() < orderedQuantity) {
                throw new RuntimeException("Not enough stock for game: " + game.getTitle());
            }

            game.setStockQuantity(game.getStockQuantity() - orderedQuantity);
            videogameRepository.save(game);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setVideogame(game);
            item.setGamePrice(game.getPrice());
            item.setQuantity(orderedQuantity);
            orderItemRepository.save(item);
        }

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

    public OrderDetailsDto getOrderDetails(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        UserPayment payment = userPaymentRepository
                .findTopByOrderIdOrderByIdDesc(orderId)
                .orElse(null);

        OrderDetailsDto dto = new OrderDetailsDto();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setContactAddress(order.getContactAddress());
        dto.setItems(order.getItems());
        dto.setStatus(order.getStatus());
        dto.setPaymentStatus(
                payment != null ? payment.getStatus() : PaymentStatus.FAILED
        );

        return dto;
    }

    @Transactional
    public Map<String, String> createStripePayment(
            Long orderId,
            BigDecimal amount,
            String username) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amountInCents);
        params.put("currency", "pln");
        params.put("payment_method_types", List.of("card"));

        try {
            PaymentIntent intent = PaymentIntent.create(params);

            UserPayment payment = new UserPayment();
            payment.setAmount(amount);
            payment.setCurrency("pln");
            payment.setPayer(user);
            payment.setOrder(order);
            payment.setStatus(PaymentStatus.CREATED);
            payment.setStripePaymentIntentId(intent.getId());

            userPaymentRepository.save(payment);

            return Map.of("clientSecret", intent.getClientSecret());

        } catch (StripeException e) {
            throw new RuntimeException("Stripe payment creation failed", e);
        }
    }

}


