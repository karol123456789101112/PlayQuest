package com.pl.PlayQuest.dto;

import lombok.Data;

@Data
public class ContactAddressViewDto {
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String buildingNumber;

    private Long apartmentNumber;

    private String street;

    private String city;

    private String country;

    private boolean isDefault;
}
