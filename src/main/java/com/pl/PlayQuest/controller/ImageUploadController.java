package com.pl.PlayQuest.controller;

import com.pl.PlayQuest.service.ImageUploadService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(imageUploadService.uploadImage(file));
    }
}

