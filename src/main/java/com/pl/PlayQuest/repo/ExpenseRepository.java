package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByOrderId(Long orderId);

    List<Expense> findByPayer_Id(Long payerId);
}