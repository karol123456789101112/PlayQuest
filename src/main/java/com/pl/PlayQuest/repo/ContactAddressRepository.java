package com.pl.PlayQuest.repo;

import com.pl.PlayQuest.model.ContactAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ContactAddressRepository extends JpaRepository<ContactAddress, Long> {
    List<ContactAddress> findByUserId(Long userId);
}

