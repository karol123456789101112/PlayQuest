package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.CategoryDto;
import com.pl.PlayQuest.dto.CategoryViewDto;
import com.pl.PlayQuest.dto.PageResponse;
import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<CategoryViewDto>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(categoryService.getAllActive(page, size));
    }

    @GetMapping("/all")
    public List<CategoryViewDto> getAllWithoutPagination() {
        return categoryService.getAllActive();
    }

    @PostMapping("/add")
    public ResponseEntity<Category> addCategory(
            @Valid @RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.add(categoryDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryViewDto> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto updatedDto) {
        return ResponseEntity.ok(categoryService.update(id, updatedDto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.softDelete(id);
        return ResponseEntity.ok().build();
    }
}
