package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.ContactAddressDto;
import com.pl.PlayQuest.dto.ContactAddressViewDto;
import com.pl.PlayQuest.mapper.AddressMapper;
import com.pl.PlayQuest.model.ContactAddress;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.repo.ContactAddressRepository;
import com.pl.PlayQuest.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactAddressService {

    private final ContactAddressRepository addressRepository;
    private final UserRepository userRepository;

    public ContactAddressService(ContactAddressRepository addressRepository,
                                 UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public List<ContactAddressViewDto> getActiveAddresses(Long userId) {
        return addressRepository.findByUserIdAndActiveTrue(userId)
                .stream()
                .map(AddressMapper::toDto)
                .toList();
    }

    public ContactAddressViewDto addAddress(ContactAddressDto dto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ContactAddress address = AddressMapper.toEntity(dto, user);
        address.setActive(true);

        ContactAddress saved = addressRepository.save(address);
        return AddressMapper.toDto(saved);
    }

    public void archiveAddress(Long id) {
        ContactAddress address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setActive(false);
        addressRepository.save(address);
    }
}
