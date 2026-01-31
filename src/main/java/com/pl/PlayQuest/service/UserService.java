package com.pl.PlayQuest.service;

import com.pl.PlayQuest.dto.UserViewDto;
import com.pl.PlayQuest.exception.InactiveUserException;
import com.pl.PlayQuest.exception.UserNotFoundException;
import com.pl.PlayQuest.mapper.UserMapper;
import com.pl.PlayQuest.model.User;
import com.pl.PlayQuest.repo.UserRepository;
import com.pl.PlayQuest.security.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import static com.pl.PlayQuest.model.Role.ADMIN;
import static com.pl.PlayQuest.model.Role.USER;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
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
    public String login(String email, String password) {

        User user = userRepository.findByUsername(email)
                .orElseThrow(() ->
                        new BadCredentialsException("badCredentials"));

        if (!user.isActive()) {
            throw new InactiveUserException("User is not active");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("badCredentials");
        }

        return jwtUtil.generateToken(user);
    }

    public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));

        user.setActive(false);
        userRepository.save(user);
    }

    public Page<UserViewDto> getAllUsers(Pageable pageable) {
        return userRepository.findByActiveTrue(pageable)
                .map(UserMapper::toViewDto);
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
