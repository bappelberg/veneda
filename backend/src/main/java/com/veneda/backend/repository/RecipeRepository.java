package com.veneda.backend.repository;

import com.veneda.backend.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository <Recipe, UUID> {
    List<Recipe> findByDeletedAtIsNull();
    Optional<Recipe> findByIdAndDeletedAtIsNull(UUID id);
}
