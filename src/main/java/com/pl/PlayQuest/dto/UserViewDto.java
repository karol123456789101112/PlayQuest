package com.pl.PlayQuest.dto;

import com.pl.PlayQuest.model.Role;
import lombok.Data;

@Data
public class UserViewDto {
    private Long id;
    private String firstName;
    private String lastName;
    private Role role;
}
