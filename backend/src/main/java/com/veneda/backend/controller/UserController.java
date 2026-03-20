package com.veneda.backend.controller;

import com.veneda.backend.dto.UserProfileResponse;
import com.veneda.backend.model.User;
import com.veneda.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        // Anonymize instead for delete - bokföringslagen requires purchase data save for 7 years.
        user.setEmail("deleted_" + user.getId() + "@deleted.veneda");
        user.setFirstName(null);
        user.setLastName(null);
        user.setPhone(null);
        user.setPasswordHash("[DELETED]");
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(new UserProfileResponse(user.getEmail(), user.getFirstName(), user.getLastName(), user.getPhone()));
    }
}
