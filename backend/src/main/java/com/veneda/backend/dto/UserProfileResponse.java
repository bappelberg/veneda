package com.veneda.backend.dto;

public record UserProfileResponse (
    String email,
    String firstName,
    String lastName,
    String phone
) {}
