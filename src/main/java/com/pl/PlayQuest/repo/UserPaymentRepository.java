package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.UserPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPaymentRepository extends JpaRepository<UserPayment, Long> {

    Optional<UserPayment> findByStripePaymentIntentId(String id);
}