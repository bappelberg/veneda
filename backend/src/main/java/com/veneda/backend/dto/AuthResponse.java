package com.veneda.backend.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {}