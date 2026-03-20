package com.veneda.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.veneda.backend.model.Purchase;
import com.veneda.backend.model.Recipe;
import com.veneda.backend.model.User;
import com.veneda.backend.repository.PurchaseRepository;
import com.veneda.backend.repository.RecipeRepository;
import com.veneda.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class StripeService {
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final PurchaseRepository purchaseRepository;
    private final EmailService emailService;
    private static final Logger log = LoggerFactory.getLogger(StripeService.class);

    @Value("${app.stripe.secret-key}")
    private String secretKey;

    @Value("${app.stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${app.stripe.success-url}")
    private String successUrl;

    @Value("${app.stripe.cancel-url}")
    private String cancelUrl;

    public StripeService(RecipeRepository recipeRepository,
                         UserRepository userRepository,
                         PurchaseRepository purchaseRepository,
                         EmailService emailService) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.purchaseRepository = purchaseRepository;
        this.emailService = emailService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public String createCheckoutSession(String userEmail, UUID recipeId, boolean withdrawalConsent) throws StripeException {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found"));

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl + "/" + recipeId)
                .putMetadata("userEmail", userEmail)
                .putMetadata("recipeId", recipeId.toString())
                .putMetadata("withdrawalConsent", String.valueOf(withdrawalConsent))
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("sek")
                                                .setUnitAmount(recipe.getPriceInOre())
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(recipe.getTitle())
                                                                .setDescription(recipe.getDescription())
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    public void handleWebhook(String payload, String sigHeader) throws StripeException {
        Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

        if (!"checkout.session.completed".equals(event.getType())) {
            return;
        }

        Session session = (Session) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new IllegalStateException("Could not deserialize Stripe event"));

        String stripeSessionId = session.getId();
        if (purchaseRepository.existsByStripeSessionId(stripeSessionId)) {
            return;
        }

        String userEmail = session.getMetadata().get("userEmail");
        UUID recipeId = UUID.fromString(session.getMetadata().get("recipeId"));
        boolean withdrawalConsent = "true".equals(session.getMetadata().get("withdrawalConsent"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found"));

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setRecipe(recipe);
        purchase.setStripeSessionId(stripeSessionId);
        purchase.setWithdrawalConsentGiven(withdrawalConsent);

        try {
            purchaseRepository.save(purchase);
        } catch (Exception e) {
            log.warn("Duplicate purchase attempt for user {} recipe {} - ignoring", userEmail, recipeId);
            return;
        }

        try {
            emailService.sendOrderConfirmation(userEmail, recipe.getTitle(), recipe.getPriceInOre());
        } catch (Exception e) {
            log.error("Failed to send order confirmation to {}: {}", userEmail, e.getMessage());
        }
    }
}