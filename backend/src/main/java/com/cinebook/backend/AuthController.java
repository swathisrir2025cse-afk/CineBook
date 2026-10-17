
package com.cinebook.backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestBody AuthRequest request) {

        Map<String, Object> response = new HashMap<>();

        if (request.getFullName() == null
                || request.getFullName().isBlank()
                || request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().length() < 8) {

            response.put("message",
                    "Enter your name, email, and a password of at least 8 characters.");

            return ResponseEntity.badRequest().body(response);
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            response.put("message", "This email is already registered.");

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(response);
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        response.put("message", "Registration successful.");
        response.put("userId", savedUser.getUserId());
        response.put("fullName", savedUser.getFullName());
        response.put("email", savedUser.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody AuthRequest request) {

        Map<String, Object> response = new HashMap<>();

        if (request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            response.put("message", "Email and password are required.");

            return ResponseEntity.badRequest().body(response);
        }

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null
                || !passwordEncoder.matches(
                        request.getPassword(), user.getPasswordHash())) {

            response.put("message", "Invalid email or password.");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        response.put("message", "Login successful.");
        response.put("userId", user.getUserId());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }
}
