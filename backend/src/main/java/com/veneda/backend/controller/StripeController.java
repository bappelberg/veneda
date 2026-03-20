package com.veneda.backend.controller;

import com.stripe.exception.StripeException;
import com.veneda.backend.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {
    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> checkout(
        @RequestParam UUID recipeId,
        @RequestParam(defaultValue = "false") boolean withdrawalConsent,
        Principal principal) throws StripeException {
            String url = stripeService.createCheckoutSession(principal.getName(), recipeId, withdrawalConsent);
            return ResponseEntity.ok(Map.of("url", url));
        }

    @PostMapping("/webhooks")
    public ResponseEntity<String> webhook(
        @RequestBody String payload,
        @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        try {
            stripeService.handleWebhook(payload, sigHeader);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
