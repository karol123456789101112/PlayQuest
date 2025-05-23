package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
