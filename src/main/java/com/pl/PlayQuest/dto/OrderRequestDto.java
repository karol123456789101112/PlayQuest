package com.pl.PlayQuest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class OrderRequestDto {
    private Long userId;
    private Long addressId;
}

