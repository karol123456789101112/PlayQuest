package com.pl.PlayQuest.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExpenseRequestDto {
    private Long orderId;
    private Long payerId;
    private BigDecimal amount;
    private String description;
}