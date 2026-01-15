package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.*;
import com.pl.PlayQuest.model.Order;
import com.pl.PlayQuest.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> getUserOrders(@RequestParam Long userId) {
        return orderService.getOrdersWithUpdatedStatuses(userId);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestBody OrderRequestDto dto) {

        Order order = orderService.createOrder(
                dto.getUserId(),
                dto.getAddressId()
        );

        return ResponseEntity.ok(
                Map.of(
                        "orderId", order.getId(),
                        "totalAmount", order.getTotalAmount()
                )
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailsDto> getOrderById(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                orderService.getOrderDetails(orderId)
        );
    }

    @PostMapping("/{orderId}/stripe-payment")
    public ResponseEntity<Map<String, String>> createStripePayment(
            @PathVariable Long orderId,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                orderService.createStripePayment(
                        orderId,
                        amount,
                        userDetails.getUsername()
                )
        );
    }

    @PostMapping("/payment/success/{orderId}")
    public ResponseEntity<Map<String, String>> markPaymentSucceeded(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails userDetails) {

        orderService.markPaymentSucceeded(orderId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("status", "payment succeeded"));
    }
}

