package com.pl.PlayQuest.mapper;

import com.pl.PlayQuest.dto.PlatformDto;
import com.pl.PlayQuest.dto.PlatformViewDto;
import com.pl.PlayQuest.model.Platform;

public class PlatformMapper {

    public static Platform toEntity(PlatformDto dto) {
        Platform platform = new Platform();
        platform.setName(dto.getName());
        platform.setActive(true);
        return platform;
    }

    public static PlatformDto toDto(Platform category) {
        PlatformDto dto = new PlatformDto();
        dto.setName(category.getName());
        return dto;
    }

    public static PlatformViewDto toViewDto(Platform category) {
        PlatformViewDto dto = new PlatformViewDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }

}
