package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
