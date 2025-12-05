package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.ExpenseRequestDto;
import com.pl.PlayQuest.dto.ExpenseResponseDto;
import com.pl.PlayQuest.mapper.ExpenseMapper;
import com.pl.PlayQuest.model.Expense;
import com.pl.PlayQuest.model.Order;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.repo.ExpenseRepository;
import com.pl.PlayQuest.repo.OrderRepository;
import com.pl.PlayQuest.repo.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    private final ExpenseMapper expenseMapper;


    public ExpenseController(ExpenseRepository expenseRepository,
                             OrderRepository orderRepository,
                             UserRepository userRepository,
                             ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
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

        Expense expense = new Expense();
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setPayer(user);
        expense.setOrder(order);

        Expense saved = expenseRepository.save(expense);
        return ResponseEntity.ok(expenseMapper.toDto(saved));
    }
}