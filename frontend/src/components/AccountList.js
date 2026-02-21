import React, { useState } from "react";
import { deposit, withdraw, suspendAccount, unsuspendAccount } from "../api";

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

  const handleUnsuspend = async (id) => {
    try {
      await unsuspendAccount(id);
      refreshAccounts();
    } catch (err) {
      alert(err.message || "Unsuspend failed");
    }
  };

  const formatBalance = (b) => {
    const n = Number(b || 0);
    return n.toLocaleString("en-KE");
  };

  return (
    <div className="accounts-grid">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className={`card account-card ${acc.status === "SUSPENDED" ? "suspended" : ""}`}
        >
          <div className="card-header">
            <div className="account-name">{acc.customerName}</div>
            <div className={`status-badge ${acc.status === "SUSPENDED" ? "suspended" : "active"}`}>
              {acc.status === "SUSPENDED" ? "Suspended" : "Active"}
            </div>
          </div>

          <div className="account-number">{acc.accountNumber}</div>

          <div className="account-balance">Ksh. {formatBalance(acc.balance)}</div>

          <input
            type="number"
            placeholder="Amount"
            value={amounts[acc.id] || ""}
            onChange={(e) => handleChange(acc.id, e.target.value)}
            className="amount-input"
          />

          <div className="account-actions-vertical">
            <button onClick={() => handleDeposit(acc.id)} className="btn-success">Deposit</button>

            <button
              onClick={() => handleWithdraw(acc.id)}
              disabled={acc.status === "SUSPENDED"}
              className="btn-warning"
            >
              Withdraw
            </button>

            {acc.status === "SUSPENDED" ? (
              <button onClick={() => handleUnsuspend(acc.id)} className="btn-primary">Unsuspend</button>
            ) : (
              <button onClick={() => handleSuspend(acc.id)} className="btn-danger">Suspend</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AccountList;
