package com.veneda.backend.controller;

import com.veneda.backend.dto.RecipeFullResponse;
import com.veneda.backend.dto.RecipeRequest;
import com.veneda.backend.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin/recipes")
public class AdminRecipeController {
    private final RecipeService recipeService;
    private static final Logger log = LoggerFactory.getLogger(RecipeService.class);

    public AdminRecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeFullResponse>> getAll() {
        return ResponseEntity.ok(recipeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeFullResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(recipeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RecipeFullResponse> create(@Valid @RequestBody RecipeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recipeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeFullResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody RecipeRequest request) {
        log.info("Information " + id + request);
        return ResponseEntity.ok(recipeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        recipeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
