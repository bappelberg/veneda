package com.veneda.backend;

import com.veneda.backend.dto.RecipeFullResponse;
import com.veneda.backend.dto.RecipePublicResponse;
import com.veneda.backend.dto.RecipeRequest;
import com.veneda.backend.model.Purchase;
import com.veneda.backend.model.Recipe;
import com.veneda.backend.repository.PurchaseRepository;
import com.veneda.backend.repository.RecipeRepository;
import com.veneda.backend.service.RecipeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock RecipeRepository recipeRepository;
    @Mock PurchaseRepository purchaseRepository;

    @InjectMocks RecipeService recipeService;

    private Recipe recipe;
    private UUID recipeId;

    @BeforeEach
    void setUp() {
        recipeId = UUID.randomUUID();
        recipe = new Recipe();
        recipe.setId(recipeId);
        recipe.setTitle("Lentil Stew");
        recipe.setDescription("A hearty lentil stew");
        recipe.setIngredients("Lentils, tomato, garlic");
        recipe.setInstructions("Simmer for 20 minutes");
        recipe.setPriceInOre(9900L);
        recipe.setImageUrl(null);
    }

    @Test
    void findAllPublic_returnsNonDeletedRecipes() {
        when(recipeRepository.findByDeletedAtIsNull()).thenReturn(List.of(recipe));

        List<RecipePublicResponse> result = recipeService.findAllPublic();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Lentil Stew");
        assertThat(result.get(0).priceInOre()).isEqualTo(9900L);
    }

    @Test
    void findPublicById_notFound_throws() {
        UUID unknownId = UUID.randomUUID();
        when(recipeRepository.findByIdAndDeletedAtIsNull(unknownId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> recipeService.findPublicById(unknownId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void create_savesAndReturnsRecipe() {
        RecipeRequest req = new RecipeRequest("Lentil Stew", "A hearty lentil stew", "Lentils, tomato", "Simmer for 20 minutes", 9900L, null);
        when(recipeRepository.save(any(Recipe.class))).thenReturn(recipe);

        RecipeFullResponse result = recipeService.create(req);

        assertThat(result.title()).isEqualTo("Lentil Stew");
        verify(recipeRepository).save(any(Recipe.class));
    }

    @Test
    void update_notFound_throws() {
        UUID unknownId = UUID.randomUUID();
        RecipeRequest req = new RecipeRequest("New title", "New description", "Ingredients", "Instructions", 5000L, null);
        when(recipeRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> recipeService.update(unknownId, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void delete_softDeletesRecipe() {
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(recipe));

        recipeService.delete(recipeId);

        assertThat(recipe.getDeletedAt()).isNotNull();
        verify(recipeRepository).save(recipe);
    }

    @Test
    void hasPurchased_returnsTrue() {
        String email = "user@example.com";
        when(purchaseRepository.existsByUserEmailAndRecipeId(email, recipeId)).thenReturn(true);

        assertThat(recipeService.hasPurchased(email, recipeId)).isTrue();
    }

    @Test
    void getCookbook_returnsPurchasedRecipes() {
        String email = "user@example.com";
        Purchase purchase = new Purchase();
        purchase.setRecipe(recipe);
        when(purchaseRepository.findByUserEmail(email)).thenReturn(List.of(purchase));

        List<RecipeFullResponse> result = recipeService.getCookBook(email);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Lentil Stew");
    }
}
