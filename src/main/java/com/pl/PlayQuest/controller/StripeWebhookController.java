package com.pl.PlayQuest.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pl.PlayQuest.model.Expense;
import com.pl.PlayQuest.model.Order;
import com.pl.PlayQuest.model.PaymentStatus;
import com.pl.PlayQuest.model.UserPayment;
import com.pl.PlayQuest.repo.ExpenseRepository;
import com.pl.PlayQuest.repo.OrderRepository;
import com.pl.PlayQuest.repo.UserPaymentRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/stripe")
public class StripeWebhookController {

    private final UserPaymentRepository payRepo;
    private final ExpenseRepository expenseRepo;
    private final String webhookSecret;
    private final ObjectMapper mapper = new ObjectMapper();

    public StripeWebhookController(UserPaymentRepository payRepo,
                                   ExpenseRepository expenseRepo,
                                   @Value("${stripe.webhook.secret:}") String webhookSecret) {
        this.payRepo = payRepo;
        this.expenseRepo = expenseRepo;
        this.webhookSecret = webhookSecret;
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handle(@RequestHeader(value = "Stripe-Signature", required = false) String sig,
                                    @RequestBody String payload) {

        com.stripe.model.Event stripeEvent;

        try {
            if (webhookSecret == null || webhookSecret.isBlank()) {
                stripeEvent = mapper.readValue(payload, com.stripe.model.Event.class);
            } else {
                stripeEvent = Webhook.constructEvent(payload, sig, webhookSecret);
            }
        } catch (SignatureVerificationException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (JsonProcessingException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Malformed JSON");
        }

        switch (stripeEvent.getType()) {
            case "payment_intent.succeeded"      -> onSucceeded(stripeEvent);
            case "payment_intent.payment_failed" -> onFailed(stripeEvent);
        }
        return ResponseEntity.ok().build();
    }

    private void onSucceeded(com.stripe.model.Event stripeEvent) {
        PaymentIntent pi = (PaymentIntent) stripeEvent.getDataObjectDeserializer()
                .getObject()
                .orElseThrow();

        Optional<UserPayment> maybe = payRepo.findByStripePaymentIntentId(pi.getId());
        if (maybe.isEmpty()) return;

        UserPayment up = maybe.get();
        up.setStatus(PaymentStatus.SUCCEEDED);
        payRepo.save(up);

        boolean exists = expenseRepo.findByPayer_Id(up.getPayer().getId()).stream()
                .anyMatch(e -> ("Stripe " + pi.getId()).equals(e.getDescription()));

        if (!exists) {
            Expense expense = new Expense(
                    null,
                    "Stripe " + pi.getId(),
                    BigDecimal.valueOf(pi.getAmount()).movePointLeft(2),
                    up.getPayer(),
                    up.getOrder()
            );
            expenseRepo.save(expense);
        }
    }

    private void onFailed(com.stripe.model.Event stripeEvent) {
        PaymentIntent pi = (PaymentIntent) stripeEvent.getDataObjectDeserializer()
                .getObject()
                .orElseThrow();

        payRepo.findByStripePaymentIntentId(pi.getId()).ifPresent(up -> {
            up.setStatus(PaymentStatus.FAILED);
            payRepo.save(up);
        });
    }
}