package com.pl.PlayQuest.mapper;

import com.pl.PlayQuest.dto.ContactAddressDto;
import com.pl.PlayQuest.dto.ContactAddressViewDto;
import com.pl.PlayQuest.model.ContactAddress;
import com.pl.PlayQuest.model.User;

public class AddressMapper {

    public static ContactAddress toEntity(ContactAddressDto dto, User user) {
        ContactAddress address = new ContactAddress();
        address.setFirstName(dto.getFirstName());
        address.setLastName(dto.getLastName());
        address.setEmail(dto.getEmail());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setStreet(dto.getStreet());
        address.setBuildingNumber(dto.getBuildingNumber());
        address.setApartmentNumber(dto.getApartmentNumber());
        address.setCity(dto.getCity());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        address.setDefault(dto.isDefault());
        address.setUser(user);
        address.setActive(true);
        return address;
    }

    public static ContactAddressViewDto toDto(ContactAddress entity) {
        ContactAddressViewDto dto = new ContactAddressViewDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setBuildingNumber(entity.getBuildingNumber());
        dto.setApartmentNumber(entity.getApartmentNumber());
        dto.setStreet(entity.getStreet());
        dto.setCity(entity.getCity());
        dto.setCountry(entity.getCountry());
        dto.setDefault(entity.isDefault());
        return dto;
    }
}
