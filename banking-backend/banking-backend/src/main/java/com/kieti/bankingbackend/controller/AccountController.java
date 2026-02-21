package com.kieti.bankingbackend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kieti.bankingbackend.dto.AccountResponse;
import com.kieti.bankingbackend.dto.CreateAccountRequest;
import com.kieti.bankingbackend.dto.TransactionRequest;
import com.kieti.bankingbackend.service.AccountService;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = {"http://localhost:3000", "https://mybankingservices.netlify.app"})
public class AccountController {

    @Autowired
    private AccountService accountService;

    /*
      Create a new account
      POST /api/accounts
     */
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /*
     Get all accounts
     GET /api/accounts
     */
    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        List<AccountResponse> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    /*
      Get account by ID
      GET /api/accounts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable Long id) {
        AccountResponse response = accountService.getAccountById(id);
        return ResponseEntity.ok(response);
    }

    /*
     Deposit money to account
     POST /api/accounts/{id}/deposit
     */
    @PostMapping("/{id}/deposit")
    public ResponseEntity<AccountResponse> deposit(
            @PathVariable Long id,
            @RequestBody TransactionRequest request) {
        AccountResponse response = accountService.deposit(id, request);
        return ResponseEntity.ok(response);
    }

    /*
     Withdraw money from account
     POST /api/accounts/{id}/withdraw
     */
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<AccountResponse> withdraw(
            @PathVariable Long id,
            @RequestBody TransactionRequest request) {
        AccountResponse response = accountService.withdraw(id, request);
        return ResponseEntity.ok(response);
    }

    /*
     Suspend account
     POST /api/accounts/{id}/suspend
     */
    @PostMapping("/{id}/suspend")
    public ResponseEntity<AccountResponse> suspendAccount(@PathVariable Long id) {
        AccountResponse response = accountService.suspendAccount(id);
        return ResponseEntity.ok(response);
    }

    /*
     Unsuspend account
     POST /api/accounts/{id}/unsuspend
     */
    @PostMapping("/{id}/unsuspend")
    public ResponseEntity<AccountResponse> unsuspendAccount(@PathVariable Long id) {
        AccountResponse response = accountService.unsuspendAccount(id);
        return ResponseEntity.ok(response);
    }

    /*
     Global exception handler for BankingException
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
