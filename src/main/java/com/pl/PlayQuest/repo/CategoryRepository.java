package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByActiveTrue();

    Page<Category> findByActiveTrue(Pageable pageable);

}
