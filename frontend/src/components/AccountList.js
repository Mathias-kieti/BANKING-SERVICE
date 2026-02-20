import React, { useState } from "react";
import { deposit, withdraw, suspendAccount } from "../api";

function AccountList({ accounts, refreshAccounts }) {
  const [amounts, setAmounts] = useState({});

  const handleChange = (id, value) => {
    setAmounts({ ...amounts, [id]: value });
  };

  const handleDeposit = async (id) => {
    try {
      await deposit(id, Number(amounts[id]));
      setAmounts({ ...amounts, [id]: "" });
      refreshAccounts();
    } catch (err) {
      alert(err.message || "Deposit failed");
    }
  };

  const handleWithdraw = async (id) => {
    try {
      await withdraw(id, Number(amounts[id]));
      setAmounts({ ...amounts, [id]: "" });
      refreshAccounts();
    } catch (err) {
      alert(err.message || "Withdrawal failed");
    }
  };

  const handleSuspend = async (id) => {
    try {
      await suspendAccount(id);
      refreshAccounts();
    } catch (err) {
      alert(err.message || "Suspend failed");
    }
  };

  return (
    <div>
      <h2>Accounts</h2>
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className={`card account-card ${
            acc.status === "SUSPENDED" ? "suspended" : ""
          }`}
        >
          <div className="account-info">  
            <p><strong>Account Number:</strong> {acc.accountNumber}</p>
            <p><strong>Name:</strong> {acc.customerName}</p>
            <p><strong>Balance:</strong> {acc.balance}</p>
            <p><strong>Status:</strong> {acc.status}</p>
          </div>

          <input
            type="number"
            placeholder="Amount"
            value={amounts[acc.id] || ""}
            onChange={(e) => handleChange(acc.id, e.target.value)}
          />

          <button onClick={() => handleDeposit(acc.id)}
            className="btn-success">
            Deposit
          </button>

          <button
            onClick={() => handleWithdraw(acc.id)}
            disabled={acc.status === "SUSPENDED"}
            className="btn-warning"
          >
            Withdraw
          </button>

          <button onClick={() => handleSuspend(acc.id)}
            className="btn-danger">
            Suspend
          </button>
        </div>
      ))}
    </div>
  );
}

export default AccountList;
