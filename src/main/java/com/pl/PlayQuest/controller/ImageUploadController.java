package com.pl.PlayQuest.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ImageUploadController {

    private final String UPLOAD_DIR = "frontend/public/images/";

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok("images/" + fileName);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Błąd podczas zapisu pliku.");
        }
    }
}
