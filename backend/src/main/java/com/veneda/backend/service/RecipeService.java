package com.veneda.backend.service;
import com.veneda.backend.dto.RecipeFullResponse;
import com.veneda.backend.dto.RecipePublicResponse;
import com.veneda.backend.dto.RecipeRequest;
import com.veneda.backend.model.Recipe;
import com.veneda.backend.repository.PurchaseRepository;
import com.veneda.backend.repository.RecipeRepository;

import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final PurchaseRepository purchaseRepository;

    public RecipeService(RecipeRepository recipeRepository,
        PurchaseRepository purchaseRepository) {
            this.recipeRepository = recipeRepository;
            this.purchaseRepository = purchaseRepository;
    }

    public List<RecipePublicResponse> findAllPublic() {
        return recipeRepository.findByDeletedAtIsNull().stream()
            .map(r -> new RecipePublicResponse(
                r.getId(), r.getTitle(), r.getDescription(),
                r.getPriceInOre(), r.getImageUrl()))
            .toList();
    }

    public RecipePublicResponse findPublicById(UUID id) {
        Recipe r = recipeRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new IllegalArgumentException("Recipe not found"));
            return new RecipePublicResponse(
                r.getId(), r.getTitle(), r.getDescription(), r.getPriceInOre(), r.getImageUrl());
    }


    private RecipeFullResponse toFull(Recipe r) {
        return new RecipeFullResponse(
            r.getId(), r.getTitle(), r.getDescription(),
            r.getIngredients(), r.getInstructions(),
            r.getPriceInOre(), r.getImageUrl()
        );
    }

    public List<RecipeFullResponse> findAll() {
        return recipeRepository.findByDeletedAtIsNull().stream().map(this::toFull).toList();
    }

    public RecipeFullResponse findById(UUID id) {
        Recipe r = recipeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Recipe not found"));
        return toFull(r);
    }

    private void applyRequest(Recipe recipe, RecipeRequest req) {
        recipe.setTitle(req.title());
        recipe.setDescription(req.description());
        recipe.setIngredients(req.ingredients());
        recipe.setInstructions(req.instructions());
        recipe.setPriceInOre(req.priceInOre());
        recipe.setImageUrl(req.imageUrl());
    }

    public RecipeFullResponse create(RecipeRequest request) {
        Recipe recipe = new Recipe();
        applyRequest(recipe, request);
        return toFull(recipeRepository.save(recipe));
    }

    public RecipeFullResponse update(UUID id, RecipeRequest request) {
        Recipe recipe = recipeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Recipe not found"));
            applyRequest(recipe, request);
            recipe.setUpdatedAt(LocalDateTime.now());
            return toFull(recipeRepository.save(recipe));
    }

    public void delete(UUID id) {
        Recipe recipe = recipeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Recipe not found"));
        recipe.setDeletedAt(LocalDateTime.now());
        recipeRepository.save(recipe);
    }
    
    public List<RecipeFullResponse> getCookBook(String email) {
        return purchaseRepository.findByUserEmail(email).stream()
        .map(p -> toFull(p.getRecipe())).toList();
    }

    public boolean hasPurchased(String email, UUID recipeId) {
        return purchaseRepository.existsByUserEmailAndRecipeId(email, recipeId);
    }

}
