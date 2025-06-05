package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.CategoryDto;
import com.pl.PlayQuest.dto.CategoryViewDto;
import com.pl.PlayQuest.mapper.CategoryMapper;
import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.repo.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/categories")
public class CategoryController {


    @Autowired
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<CategoryViewDto> getAllCategories() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(CategoryMapper::toViewDto)
                .toList();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCategory(@Valid @RequestBody CategoryDto categoryDto) {
        Category saved = categoryRepository.save(CategoryMapper.toEntity(categoryDto));
        return ResponseEntity.ok(saved);
    }

    @GetMapping("{id}")
    public ResponseEntity<CategoryViewDto> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(CategoryMapper::toViewDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDto updatedDto) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedDto.getName());
                    return ResponseEntity.ok(categoryRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setActive(false);
        categoryRepository.save(category);

        return ResponseEntity.ok().build();
    }
}
