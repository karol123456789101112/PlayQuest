package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.OrderRequestDto;
import com.pl.PlayQuest.model.Order;
import com.pl.PlayQuest.repo.OrderRepository;
import com.pl.PlayQuest.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    OrderService orderService;
    OrderRepository orderRepository;
    @GetMapping
    public List<Order> getUserOrders(@RequestParam Long userId) {
        return orderService.getOrdersWithUpdatedStatuses(userId);
    }

    @PostMapping
    public ResponseEntity<Void> createOrder(@RequestBody OrderRequestDto dto) {
        orderService.createOrder(dto.getUserId(), dto.getAddressId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
