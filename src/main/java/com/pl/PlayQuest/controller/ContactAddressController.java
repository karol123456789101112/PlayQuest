package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.model.ContactAddress;
import com.pl.PlayQuest.repo.ContactAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactAddressController {

    @Autowired
    private ContactAddressRepository addressRepository;

    @GetMapping
    public List<ContactAddress> getUserAddresses(@RequestParam Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<ContactAddress> addAddress(@RequestBody ContactAddress address) {
        ContactAddress saved = addressRepository.save(address);
        return ResponseEntity.ok(saved);
    }

}
