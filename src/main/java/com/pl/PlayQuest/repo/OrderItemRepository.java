package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
