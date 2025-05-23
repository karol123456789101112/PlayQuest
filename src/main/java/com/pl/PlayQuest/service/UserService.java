package com.pl.PlayQuest.service;

import com.pl.PlayQuest.exception.UserNotFoundException;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.model.Role;
import com.pl.PlayQuest.repo.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;

import static com.pl.PlayQuest.model.Role.ADMIN;
import static com.pl.PlayQuest.model.Role.USER;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(String email, String password, String firstName, String lastName) {
        if (userRepository.findByUsername(email).isPresent()) {
            throw new RuntimeException("Użytkownik o tym emailu już istnieje!");
        }

        User user = new User();
        user.setUsername(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(USER);

        return userRepository.save(user);
    }
    public boolean authenticateUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }

    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User with id " + id + " not found");
        }
        userRepository.deleteById(id);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleAdminRole(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.getRole() == ADMIN){
            user.setRole(USER);
        }
        else{
            user.setRole(ADMIN);
        }
        return userRepository.save(user);
    }


    public Optional<User> findByUsername(String username){
        return userRepository.findByUsername(username);
    }
}
