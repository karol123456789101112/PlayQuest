package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
