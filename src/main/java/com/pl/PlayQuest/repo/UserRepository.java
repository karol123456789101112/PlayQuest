package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Category;
import com.pl.PlayQuest.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByActiveTrue();

    Page<User> findByActiveTrue(Pageable pageable);
}
