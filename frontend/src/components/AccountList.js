import React, { useState } from "react";
import { deposit, withdraw, suspendAccount, unsuspendAccount } from "../api";

function AccountList({ accounts, refreshAccounts }) {
  const [amounts, setAmounts] = useState({});

  const handleChange = (id, field, value) => {
    setAmounts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const handleDeposit = async (id) => {
    try {
      await deposit(id, Number(amounts[id]?.deposit));
      setAmounts((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), deposit: "" } }));
      refreshAccounts();
    } catch (err) {
      alert(err.message || "Deposit failed");
    }
  };

  const handleWithdraw = async (id) => {
    try {
      await withdraw(id, Number(amounts[id]?.withdraw));
      setAmounts((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), withdraw: "" } }));
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

  const formatBalance = (b) => Number(b || 0).toLocaleString("en-KE");

  return (
    <div className="accounts-grid">
      {accounts.map((acc) => {
        const isSuspended = acc.status === "SUSPENDED";
        return (
          <div
            key={acc.id}
            className={`card account-card ${isSuspended ? "suspended" : ""}`}
          >
            <div className="card-header">
              <div className="account-name">{acc.customerName}</div>
              <div className={`status-badge ${isSuspended ? "suspended" : "active"}`}>
                {isSuspended ? "Suspended" : "Active"}
              </div>
            </div>

            <div className="account-number">{acc.accountNumber}</div>

            <p>Balance</p>
            <div className="account-balance">Ksh. {formatBalance(acc.balance)}</div>

            <div className="account-actions-vertical">
              <div>
                <input
                  type="number"
                  placeholder="Deposit amount"
                  value={amounts[acc.id]?.deposit || ""}
                  onChange={(e) => handleChange(acc.id, "deposit", e.target.value)}
                  min="0"
                />
                <button onClick={() => handleDeposit(acc.id)} className="btn-success">
                  Deposit
                </button>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Withdraw amount"
                  value={amounts[acc.id]?.withdraw || ""}
                  onChange={(e) => handleChange(acc.id, "withdraw", e.target.value)}
                  min="0"
                  disabled={isSuspended}
                />
                <button
                  onClick={() => handleWithdraw(acc.id)}
                  disabled={isSuspended}
                  className="btn-warning"
                >
                  Withdraw
                </button>
              </div>

              {isSuspended ? (
                <button onClick={() => handleUnsuspend(acc.id)} className="btn-primary">
                  Unsuspend
                </button>
              ) : (
                <button onClick={() => handleSuspend(acc.id)} className="btn-danger">
                  Suspend
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AccountList;
