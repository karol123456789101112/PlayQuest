package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.ExpenseRequestDto;
import com.pl.PlayQuest.dto.ExpenseResponseDto;
import com.pl.PlayQuest.mapper.ExpenseMapper;
import com.pl.PlayQuest.model.*;
import com.pl.PlayQuest.repo.ExpenseRepository;
import com.pl.PlayQuest.repo.OrderRepository;
import com.pl.PlayQuest.repo.UserPaymentRepository;
import com.pl.PlayQuest.repo.UserRepository;
import com.pl.PlayQuest.service.ExpenseService;
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

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponseDto>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @PostMapping
    public ResponseEntity<ExpenseResponseDto> createExpense(
            @RequestBody ExpenseRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                expenseService.createExpense(dto, userDetails.getUsername())
        );
    }
}
