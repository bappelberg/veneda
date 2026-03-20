package com.veneda.backend.controller;

import com.veneda.backend.dto.RecipeFullResponse;
import com.veneda.backend.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/api/cookbook")
public class CookbookController {
    private final RecipeService recipeService;

    public CookbookController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeFullResponse>> getCookbook(Principal principal) {
        return ResponseEntity.ok(recipeService.getCookBook(principal.getName()));
    }

    @GetMapping("/check/{recipeId}")
    public ResponseEntity<Map<String, Boolean>> hasPurchased(
        @PathVariable UUID recipeId,
        Principal principal) {
            boolean purchased = recipeService.hasPurchased(principal.getName(), recipeId);
            return ResponseEntity.ok(Map.of("purchased", purchased));
        }
}
