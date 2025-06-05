package com.pl.PlayQuest.mapper;

import com.pl.PlayQuest.dto.UserViewDto;
import com.pl.PlayQuest.model.User;

public class UserMapper {
    public static UserViewDto toViewDto(User user) {
        UserViewDto dto = new UserViewDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        return dto;
    }
}
