package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.OrderRequestDto;
import com.pl.PlayQuest.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    OrderService orderService;
    @PostMapping
    public ResponseEntity<Void> createOrder(@RequestBody OrderRequestDto dto) {
        orderService.createOrder(dto.getUserId(), dto.getAddressId());
        return ResponseEntity.ok().build();
    }
}
