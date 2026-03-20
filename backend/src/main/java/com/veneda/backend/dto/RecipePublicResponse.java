package com.veneda.backend.dto;

import java.util.UUID;

public record RecipePublicResponse(
    UUID id,
    String title,
    String description,
    Long priceInOre,
    String imageUrl
) {}