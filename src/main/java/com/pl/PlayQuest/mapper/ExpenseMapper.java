package com.pl.PlayQuest.mapper;

import com.pl.PlayQuest.model.Expense;
import com.pl.PlayQuest.dto.ExpenseResponseDto;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public ExpenseResponseDto toDto(Expense expense) {
        if (expense == null) {
            return null;
        }

        ExpenseResponseDto dto = new ExpenseResponseDto();
        dto.setId(expense.getId());

        if (expense.getPayer() != null) {
            dto.setPayerId(expense.getPayer().getId());
            dto.setPayerFullName(expense.getPayer().getFirstName() + " " + expense.getPayer().getLastName());
        }

        if (expense.getOrder() != null) {
            dto.setOrderId(expense.getOrder().getId());
        }

        dto.setAmount(expense.getAmount());
        dto.setDescription(expense.getDescription());

        return dto;
    }
}

