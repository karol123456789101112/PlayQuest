package com.pl.PlayQuest.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ContactAddressDto {

    @NotBlank(message = "First name is required")
    @Size(max = 40, message = "Max 40 characters")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Only letters allowed")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 80, message = "Max 80 characters")
    @Pattern(regexp = "^[A-Za-z\\-\\s]+$", message = "Only letters, spaces, and hyphens allowed")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    @Size(max = 80, message = "Max 80 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{9,10}$", message = "Must be 9 or 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Street is required")
    @Size(max = 80, message = "Max 80 characters")
    @Pattern(regexp = "^[A-Za-z\\s\\-]+$", message = "Only letters, spaces, and hyphens allowed")
    private String street;

    @NotBlank(message = "Building number is required")
    @Size(max = 8, message = "Max 8 characters")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "Only letters and digits allowed")
    private String buildingNumber;

    @Positive(message = "Must be positive")
    @Max(value = 9999, message = "Max 4 digits")
    private Long apartmentNumber;

    @NotBlank(message = "City is required")
    @Size(max = 80, message = "Max 80 characters")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Only letters and spaces allowed")
    private String city;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^\\d{2,3}-\\d{2,3}$", message = "Format: 123-45 or 12-345")
    private String postalCode;

    @NotBlank(message = "Country is required")
    @Size(max = 80, message = "Max 80 characters")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Only letters and spaces allowed")
    private String country;

    private boolean isDefault;
}

