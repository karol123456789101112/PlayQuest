package com.pl.PlayQuest.dto;

import com.pl.PlayQuest.model.ContactAddress;
import com.pl.PlayQuest.model.OrderItem;
import com.pl.PlayQuest.model.OrderStatus;
import com.pl.PlayQuest.model.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDetailsDto {
    private Long id;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private ContactAddress contactAddress;
    private OrderStatus status;
    private List<OrderItem> items;
    private PaymentStatus paymentStatus;
}

