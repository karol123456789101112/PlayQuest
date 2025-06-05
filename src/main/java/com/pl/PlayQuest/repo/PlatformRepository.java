package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.model.Platform;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlatformRepository extends JpaRepository<Platform, Long> {
    List<Platform> findByActiveTrue();

    Page<Platform> findByActiveTrue(Pageable pageable);
}
