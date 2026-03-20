package com.veneda.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public void sendOrderConfirmation(String toEmail, String recipeName, long priceInOre) {
        long priceKr = priceInOre / 100;
        long vatKr = Math.round(priceKr * 0.20);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(fromEmail);
        message.setSubject("Order confirmation - " + recipeName);
        message.setText("""
            Thank you for your purchase!
            
            You have purchased: %s
            Price (incl. 25%% VAT): %d kr

            You can find your recipe in your Cookbook at veneda.se/cookbook

            If you have any questions, contact us at support@veneda.se

            Best regards,
            Veneda AB
            """.formatted(recipeName, priceKr, vatKr));
        mailSender.send(message);
    }
}
