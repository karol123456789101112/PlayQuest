package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.ContactAddressDto;
import com.pl.PlayQuest.dto.ContactAddressViewDto;
import com.pl.PlayQuest.mapper.AddressMapper;
import com.pl.PlayQuest.model.ContactAddress;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.repo.ContactAddressRepository;
import com.pl.PlayQuest.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactAddressController {

    @Autowired
    private ContactAddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<ContactAddressViewDto> getActiveAddresses(@RequestParam Long userId) {
        return addressRepository.findByUserIdAndActiveTrue(userId)
                .stream()
                .map(AddressMapper::toDto)
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> addAddress(@Valid @RequestBody ContactAddressDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ContactAddress address = AddressMapper.toEntity(dto, user);
        ContactAddress saved = addressRepository.save(address);

        return ResponseEntity.ok(AddressMapper.toDto(saved));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archiveAddress(@PathVariable Long id) {
        ContactAddress address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setActive(false);
        addressRepository.save(address);

        return ResponseEntity.noContent().build();
    }
}

