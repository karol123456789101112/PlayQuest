package com.pl.PlayQuest.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_payments")
public class UserPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
    private String currency;
    private String stripePaymentIntentId;
    private LocalDateTime paidAt;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @ManyToOne
    private Order order;

    @ManyToOne
    private User payer;
}