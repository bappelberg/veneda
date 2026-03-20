package com.veneda.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
        @NotBlank(message = "Email required")
        @Email(message = "Invalid email")
        String email,

        @NotBlank(message = "Password required")
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$",
                message = "The password must be at least 8 characters long and include an uppercase letter, a number, and a special character."
        )
        String password,

        String firstName,
        String lastName,
        String phone
) {}