package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.ExpenseRequestDto;
import com.pl.PlayQuest.dto.ExpenseResponseDto;
import com.pl.PlayQuest.mapper.ExpenseMapper;
import com.pl.PlayQuest.model.*;
import com.pl.PlayQuest.repo.ExpenseRepository;
import com.pl.PlayQuest.repo.OrderRepository;
import com.pl.PlayQuest.repo.UserPaymentRepository;
import com.pl.PlayQuest.repo.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDate;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final UserPaymentRepository userPaymentRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseController(ExpenseRepository expenseRepository,
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

    @GetMapping
    public ResponseEntity<List<ExpenseResponseDto>> getAllExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        List<ExpenseResponseDto> dtos = expenses.stream()
                .map(expenseMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }


    @PostMapping
    public ResponseEntity<ExpenseResponseDto> createExpense(
            @RequestBody ExpenseRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("CREATE EXPENSE ENDPOINT HIT");

        Optional<Order> orderOpt = orderRepository.findById(dto.getOrderId());
        if (orderOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Order order = orderOpt.get();

        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userOpt.get();

        UserPayment payment = userPaymentRepository
                .findTopByOrderIdOrderByIdDesc(order.getId())
                .orElseThrow(() -> new RuntimeException("Payment not found for order"));

        payment.setStatus(PaymentStatus.SUCCEEDED);
        payment.setPaidAt(LocalDateTime.now());
        userPaymentRepository.save(payment);

        System.out.println("PAYMENT UPDATED TO SUCCEEDED");

        Expense expense = new Expense();
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setPayer(user);
        expense.setOrder(order);

        Expense saved = expenseRepository.save(expense);

        return ResponseEntity.ok(expenseMapper.toDto(saved));
    }
}