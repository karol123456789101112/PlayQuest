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
    public List<ContactAddress> getActiveAddresses(@RequestParam Long userId) {
        return addressRepository.findByUserIdAndActiveTrue(userId);
    }

    @PostMapping
    public ResponseEntity<ContactAddress> addAddress(@RequestBody ContactAddress address) {
        ContactAddress saved = addressRepository.save(address);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archiveAddress(@PathVariable Long id) {
        ContactAddress address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adres nie istnieje"));

        address.setActive(false);
        addressRepository.save(address);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(@PathVariable Long id) {
        ContactAddress toSet = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        addressRepository.findByUserIdAndActiveTrue(toSet.getUser().getId())
                .forEach(addr -> {
                    if (addr.isDefault()) {
                        addr.setDefault(false);
                        addressRepository.save(addr);
                    }
                });

        toSet.setDefault(true);
        addressRepository.save(toSet);
        return ResponseEntity.ok().build();
    }


}
