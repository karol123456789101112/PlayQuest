package com.pl.PlayQuest.mapper;

import com.pl.PlayQuest.dto.CategoryDto;
import com.pl.PlayQuest.dto.CategoryViewDto;
import com.pl.PlayQuest.model.Category;

public class CategoryMapper {

    public static Category toEntity(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setActive(true);
        return category;
    }

    public static CategoryDto toDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setName(category.getName());
        return dto;
    }

    public static CategoryViewDto toViewDto(Category category) {
        CategoryViewDto dto = new CategoryViewDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }

}
