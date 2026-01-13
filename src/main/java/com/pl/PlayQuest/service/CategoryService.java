package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.CategoryDto;
import com.pl.PlayQuest.dto.CategoryViewDto;
import com.pl.PlayQuest.dto.PageResponse;
import com.pl.PlayQuest.mapper.CategoryMapper;
import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.repo.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public PageResponse<CategoryViewDto> getAllActive(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categoryPage = categoryRepository.findByActiveTrue(pageable);

        List<CategoryViewDto> dtoList = categoryPage.getContent()
                .stream()
                .map(CategoryMapper::toViewDto)
                .toList();

        return new PageResponse<>(
                dtoList,
                categoryPage.getTotalPages(),
                categoryPage.getTotalElements(),
                categoryPage.getNumber(),
                categoryPage.getSize()
        );
    }

    public List<CategoryViewDto> getAllActive() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(CategoryMapper::toViewDto)
                .toList();
    }

    public Category add(CategoryDto categoryDto) {
        Category category = CategoryMapper.toEntity(categoryDto);
        category.setActive(true);
        return categoryRepository.save(category);
    }

    public CategoryViewDto getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return CategoryMapper.toViewDto(category);
    }

    public Category update(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(dto.getName());
        return categoryRepository.save(category);
    }

    public void softDelete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setActive(false);
        categoryRepository.save(category);
    }
}

