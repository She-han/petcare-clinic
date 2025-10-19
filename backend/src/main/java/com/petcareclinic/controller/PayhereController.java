package com.petcareclinic.controller;

import com.petcareclinic.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin // React app එක වෙනම port එකක run වන නිසා (e.g., localhost:3000)
public class PayhereController {

    // application.properties file එකෙන් merchant details ලබාගන්නවා
    @Value("${payhere.merchant.id}")
    private String merchantId;
    
    @Value("${payhere.merchant.secret}")
    private String merchantSecret;
    
    @Autowired
    private OrderService orderService;

    @PostMapping("/payhere-notify")
    public ResponseEntity<String> handlePayhereNotification(@RequestBody Map<String, String> payload) {
        
        System.out.println("--- Received Payhere Notification ---");
        System.out.println(payload.toString());
        System.out.println("------------------------------------");

        String orderId = payload.get("order_id");
        String statusCode = payload.get("status_code");
        String md5sig = payload.get("md5sig");

        // --- Best Practice: Hash Verification (වංචනික ගනුදෙනු වලින් ආරක්ෂා වීමට) ---
        // Payhere documentation එකට අනුව, අපේ පැත්තෙන් hash එකක් generate කරලා,
        // Payhere එකෙන් එවන md5sig එකට සමානද කියලා බලන්න ඕන.
        // මෙය production-level යෙදුමකදී අනිවාර්යයි.
        // දැනට, අපි ලැබෙන දත්ත print කරලා බලමු.
        System.out.println("Received Signature: " + md5sig);
        System.out.println("My Merchant Secret (for verification): " + merchantSecret);


        // Status Code එක '2' කියන්නේ ගෙවීම සාර්ථකයි.
        if (statusCode != null && statusCode.equals("2")) {
            
            try {
                // Database එකේ අදාල order එක 'COMPLETED' කියලා update කරනවා
                orderService.updateOrderPaymentStatus(orderId, "COMPLETED");
                System.out.println("SUCCESS: Payment for order " + orderId + " was successful and order status updated.");
            } catch (Exception e) {
                System.err.println("ERROR: Failed to update order status for order " + orderId + ": " + e.getMessage());
            }

        } else {
            // ගෙවීම අසාර්ථකයි හෝ අවලංගු කරලා.
            try {
                orderService.updateOrderPaymentStatus(orderId, "FAILED");
                System.out.println("FAILED/CANCELLED: Payment for order " + orderId + " failed with status: " + statusCode + " and order status updated.");
            } catch (Exception e) {
                System.err.println("ERROR: Failed to update order status for order " + orderId + ": " + e.getMessage());
            }
        }

        // Payhere server එකට "හරි, මට message එක ලැබුණා" කියලා දැනුම් දෙන්න 200 OK response එකක් යවනවා.
        return ResponseEntity.ok("Received");
    }
    
    @PostMapping("/generate-hash")
    public ResponseEntity<Map<String, String>> generatePaymentHash(@RequestBody Map<String, Object> request) {
        try {
            String orderId = request.get("orderId").toString();
            String amount = request.get("amount").toString();
            String currency = request.get("currency").toString();
            
            // Format amount to 2 decimal places
            DecimalFormat df = new DecimalFormat("0.00");
            String amountFormatted = df.format(Double.parseDouble(amount));
            
            // Generate hash according to PayHere documentation
            // hash = MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase()).toUpperCase()
            String hashedSecret = getMd5(merchantSecret).toUpperCase();
            String hashString = merchantId + orderId + amountFormatted + currency + hashedSecret;
            String hash = getMd5(hashString).toUpperCase();
            
            System.out.println("=== PayHere Hash Generation ===");
            System.out.println("Merchant ID: " + merchantId);
            System.out.println("Merchant Secret (first 10 chars): " + merchantSecret.substring(0, Math.min(10, merchantSecret.length())) + "...");
            System.out.println("Order ID: " + orderId);
            System.out.println("Amount: " + amountFormatted);
            System.out.println("Currency: " + currency);
            System.out.println("Hashed Secret: " + hashedSecret);
            System.out.println("Hash String: " + hashString);
            System.out.println("Generated Hash: " + hash);
            System.out.println("===============================");
            
            Map<String, String> response = new HashMap<>();
            response.put("hash", hash);
            response.put("merchant_id", merchantId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error generating PayHere hash: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to generate hash");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // MD5 hash generation method
    public static String getMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashtext = no.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext.toUpperCase();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}