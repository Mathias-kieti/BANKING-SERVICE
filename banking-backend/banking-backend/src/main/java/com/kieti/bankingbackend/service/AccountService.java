package com.kieti.bankingbackend.service;

import com.kieti.bankingbackend.dto.AccountResponse;
import com.kieti.bankingbackend.dto.CreateAccountRequest;
import com.kieti.bankingbackend.dto.TransactionRequest;
import com.kieti.bankingbackend.entity.Account;
import com.kieti.bankingbackend.exception.BankingException;
import com.kieti.bankingbackend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Create a new bank account
     * Business Rules:
     * - Initial deposit must be >= 0
     * - Status defaults to ACTIVE
     */
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            throw new BankingException("Customer name is required");
        }

        // Prevent duplicate accounts with same customer name
        String custName = request.getCustomerName().trim();
        if (accountRepository.findByCustomerName(custName).isPresent()) {
            throw new BankingException("An account already exists for customer: " + custName);
        }

        if (request.getInitialDeposit() == null) {
            throw new BankingException("Initial deposit is required");
        }

        if (request.getInitialDeposit().compareTo(BigDecimal.ZERO) < 0) {
            throw new BankingException("Initial deposit must be >= 0");
        }

        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setCustomerName(request.getCustomerName());
        account.setBalance(request.getInitialDeposit());
        account.setStatus("ACTIVE");

        Account savedAccount = accountRepository.save(account);
        return AccountResponse.fromEntity(savedAccount);
    }

    /**
     * Get all accounts
     */
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(AccountResponse::fromEntity)
                .toList();
    }

    /**
     * Get account by ID
     */
    @Transactional(readOnly = true)
    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new BankingException("Account not found with id: " + id));
        return AccountResponse.fromEntity(account);
    }

    /**
     * Deposit money into account
     * Business Rules:
     * - Amount must be > 0
     * - Deposits are always allowed (even if suspended)
     */
    @Transactional
    public AccountResponse deposit(Long id, TransactionRequest request) {
        if (request.getAmount() == null) {
            throw new BankingException("Deposit amount is required");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BankingException("Deposit amount must be > 0");
        }

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new BankingException("Account not found with id: " + id));

        account.setBalance(account.getBalance().add(request.getAmount()));
        Account savedAccount = accountRepository.save(account);
        return AccountResponse.fromEntity(savedAccount);
    }

    /**
     * Withdraw money from account
     * Business Rules:
     * - Amount must be > 0
     * - Balance must be sufficient
     * - Account must be ACTIVE
     * - Balance must never go negative
     */
    @Transactional
    public AccountResponse withdraw(Long id, TransactionRequest request) {
        if (request.getAmount() == null) {
            throw new BankingException("Withdrawal amount is required");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BankingException("Withdrawal amount must be > 0");
        }

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new BankingException("Account not found with id: " + id));

        // Check if account is suspended
        if ("SUSPENDED".equals(account.getStatus())) {
            throw new BankingException("Cannot withdraw from a suspended account");
        }

        // Check sufficient balance
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BankingException("Insufficient balance. Current balance: " + account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        Account savedAccount = accountRepository.save(account);
        return AccountResponse.fromEntity(savedAccount);
    }

    /**
     * Suspend account
     * Status becomes SUSPENDED
     */
    @Transactional
    public AccountResponse suspendAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new BankingException("Account not found with id: " + id));

        account.setStatus("SUSPENDED");
        Account savedAccount = accountRepository.save(account);
        return AccountResponse.fromEntity(savedAccount);
    }

    /**
     * Generate unique account number
     */
    private String generateAccountNumber() {
        return "ACC" + UUID.randomUUID().toString().replace("-", "").substring(0, 17);
    }
}
