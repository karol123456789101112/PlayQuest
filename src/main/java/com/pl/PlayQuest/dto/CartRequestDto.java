package com.pl.PlayQuest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartRequestDto {
    private Long userId;
    private Long gameId;
    private Long quantity;
}
