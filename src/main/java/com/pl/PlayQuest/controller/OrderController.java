package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.OrderRequestDto;
import com.pl.PlayQuest.exception.NotFoundException;
import com.pl.PlayQuest.model.Order;
import com.pl.PlayQuest.model.PaymentStatus;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.model.UserPayment;
import com.pl.PlayQuest.repo.OrderRepository;
import com.pl.PlayQuest.repo.UserPaymentRepository;
import com.pl.PlayQuest.repo.UserRepository;
import com.pl.PlayQuest.service.OrderService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    OrderService orderService;
    OrderRepository orderRepository;
    UserRepository userRepository;
    UserPaymentRepository userPaymentRepository;
    @GetMapping
    public List<Order> getUserOrders(@RequestParam Long userId) {
        return orderService.getOrdersWithUpdatedStatuses(userId);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequestDto dto) {
        Order order = orderService.createOrder(dto.getUserId(), dto.getAddressId());

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getId());
        response.put("totalAmount", order.getTotalAmount());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{orderId}/stripe-payment")
    public ResponseEntity<Map<String, String>> createStripePayment(
            @PathVariable Long orderId,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserDetails userDetails) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found"));

        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amountInCents);
        params.put("currency", "pln");
        params.put("payment_method_types", List.of("card"));

        PaymentIntent intent;
        try{
            intent = PaymentIntent.create(params);
            UserPayment payment = new UserPayment();
            payment.setAmount(amount);
            payment.setCurrency("pln");
            payment.setPayer(user);
            payment.setOrder(order);
            payment.setStatus(PaymentStatus.CREATED);
            payment.setStripePaymentIntentId(intent.getId());
            userPaymentRepository.save(payment);
        }
        catch(StripeException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Stripe payment creation failed"));
        }
        return ResponseEntity.ok(Map.of("clientSecret", intent.getClientSecret()));
    }

}
