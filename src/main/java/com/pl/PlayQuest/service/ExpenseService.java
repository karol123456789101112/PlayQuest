package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.ExpenseRequestDto;
import com.pl.PlayQuest.dto.ExpenseResponseDto;
import com.pl.PlayQuest.mapper.ExpenseMapper;
import com.pl.PlayQuest.model.*;
import com.pl.PlayQuest.repo.ExpenseRepository;
import com.pl.PlayQuest.repo.OrderRepository;
import com.pl.PlayQuest.repo.UserPaymentRepository;
import com.pl.PlayQuest.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final UserPaymentRepository userPaymentRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseService(ExpenseRepository expenseRepository,
                          OrderRepository orderRepository,
                          UserRepository userRepository,
                          UserPaymentRepository userPaymentRepository,
                          ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.userPaymentRepository = userPaymentRepository;
        this.expenseMapper = expenseMapper;
    }

    public List<ExpenseResponseDto> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(expenseMapper::toDto)
                .toList();
    }

    @Transactional
    public ExpenseResponseDto createExpense(
            ExpenseRequestDto dto,
            String username) {

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        UserPayment payment = userPaymentRepository
                .findTopByOrderIdOrderByIdDesc(order.getId())
                .orElseThrow(() ->
                        new RuntimeException("Payment not found for order"));

        payment.setStatus(PaymentStatus.SUCCEEDED);
        payment.setPaidAt(LocalDateTime.now());
        userPaymentRepository.save(payment);

        Expense expense = new Expense();
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setPayer(user);
        expense.setOrder(order);

        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toDto(saved);
    }
}
