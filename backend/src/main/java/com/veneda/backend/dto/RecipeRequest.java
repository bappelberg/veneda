package com.veneda.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RecipeRequest(
    @NotBlank String title,
    @NotBlank String description,
    @NotBlank String ingredients,
    @NotBlank String instructions,
    @NotNull @Positive Long priceInOre,
    String imageUrl
) {}
