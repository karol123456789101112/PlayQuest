package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
