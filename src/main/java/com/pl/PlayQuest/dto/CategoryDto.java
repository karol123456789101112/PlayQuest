package com.pl.PlayQuest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryDto {

    @NotBlank(message = "Category name is required")
    @Size(max = 80, message = "Max 80 characters allowed")
    @Pattern(regexp = "^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\\s\\-]+$", message = "Only letters, spaces, and hyphens allowed")
    private String name;
}
