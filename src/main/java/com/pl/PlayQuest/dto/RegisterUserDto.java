package com.pl.PlayQuest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterUserDto {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Size(max = 80, message = "Email must be at most 80 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 40, message = "Password must be between 8 and 40 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$",
            message = "Password must include uppercase, lowercase, number, and special character"
    )
    private String password;

    @NotBlank(message = "First name is required")
    @Size(max = 40, message = "First name must be at most 40 characters")
    @Pattern(regexp = "^[A-Za-z]{1,40}$", message = "Only letters allowed in first name")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 80, message = "Last name must be at most 80 characters")
    @Pattern(regexp = "^[A-Za-z\\-\\s]{1,80}$", message = "Only letters, spaces, and hyphens allowed in last name")
    private String lastName;
}
