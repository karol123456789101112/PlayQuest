package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PlatformRepository extends JpaRepository<Platform, Long> {
}
