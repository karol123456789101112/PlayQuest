package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.PageResponse;
import com.pl.PlayQuest.dto.PlatformDto;
import com.pl.PlayQuest.dto.PlatformViewDto;
import com.pl.PlayQuest.mapper.PlatformMapper;
import com.pl.PlayQuest.model.Platform;
import com.pl.PlayQuest.repo.PlatformRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlatformService {

    private final PlatformRepository platformRepository;

    public PlatformService(PlatformRepository platformRepository) {
        this.platformRepository = platformRepository;
    }

    public PageResponse<PlatformViewDto> getAllActive(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Platform> platformPage = platformRepository.findByActiveTrue(pageable);

        List<PlatformViewDto> dtoList = platformPage.getContent()
                .stream()
                .map(PlatformMapper::toViewDto)
                .toList();

        return new PageResponse<>(
                dtoList,
                platformPage.getTotalPages(),
                platformPage.getTotalElements(),
                platformPage.getNumber(),
                platformPage.getSize()
        );
    }

    public List<PlatformViewDto> getAllActive() {
        return platformRepository.findByActiveTrue()
                .stream()
                .map(PlatformMapper::toViewDto)
                .toList();
    }

    public Platform add(PlatformDto dto) {
        Platform platform = PlatformMapper.toEntity(dto);
        platform.setActive(true);
        return platformRepository.save(platform);
    }

    public PlatformViewDto getById(Long id) {
        Platform platform = platformRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platform not found"));
        return PlatformMapper.toViewDto(platform);
    }

    public Platform update(Long id, PlatformDto dto) {
        Platform platform = platformRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platform not found"));

        platform.setName(dto.getName());
        return platformRepository.save(platform);
    }

    public void softDelete(Long id) {
        Platform platform = platformRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platform not found"));

        platform.setActive(false);
        platformRepository.save(platform);
    }
}

