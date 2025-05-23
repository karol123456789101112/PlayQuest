package com.pl.PlayQuest.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "videogame_id", nullable = false)
    private Videogame videogame;

    @Column(nullable = false)
    private BigDecimal gamePrice;

    @Column(nullable = false)
    private Long quantity;
}