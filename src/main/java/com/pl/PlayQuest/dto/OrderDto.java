package com.pl.PlayQuest.dto;

import com.pl.PlayQuest.model.OrderStatus;
import com.pl.PlayQuest.model.PaymentStatus;
import lombok.Data;

import java.time.LocalDateTime;
@Data

public class OrderDto {
    private Long id;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
}

