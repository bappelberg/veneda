package com.veneda.backend.dto;

import java.util.UUID;

public record RecipeFullResponse(
    UUID id,
    String title,
    String description,
    String ingredients,
    String instructions,
    Long priceInOre,
    String imageUrl
) {}
