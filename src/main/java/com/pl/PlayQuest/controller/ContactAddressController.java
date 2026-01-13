package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.dto.ContactAddressDto;
import com.pl.PlayQuest.dto.ContactAddressViewDto;
import com.pl.PlayQuest.service.ContactAddressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactAddressController {

    private final ContactAddressService addressService;

    public ContactAddressController(ContactAddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public List<ContactAddressViewDto> getActiveAddresses(@RequestParam Long userId) {
        return addressService.getActiveAddresses(userId);
    }

    @PostMapping
    public ResponseEntity<ContactAddressViewDto> addAddress(
            @Valid @RequestBody ContactAddressDto dto) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(addressService.addAddress(dto, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archiveAddress(@PathVariable Long id) {
        addressService.archiveAddress(id);
        return ResponseEntity.noContent().build();
    }
}



