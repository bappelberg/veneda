package com.veneda.backend.controller;

import com.veneda.backend.dto.RecipeFullResponse;
import com.veneda.backend.dto.RecipePublicResponse;
import com.veneda.backend.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/recipes")
public class PublicRecipeController {
    private final RecipeService recipeService;

    public PublicRecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeFullResponse>> getAll() {
        return ResponseEntity.ok(recipeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipePublicResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(recipeService.findPublicById(id));
    }
}
