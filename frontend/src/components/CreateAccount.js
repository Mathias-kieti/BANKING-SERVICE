import React, { useState } from "react";
import { createAccount } from "../api";

function CreateAccount({ onAccountCreated }){
    const [customerName, setCustomerName] = useState("");
    const [initialDeposit, setInitialDeposit] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!customerName || initialDeposit < 0) {
            alert("Invalid input");
            return;
        }
        try {
            const newAccount = await createAccount({
                customerName,
                initialDeposit: Number(initialDeposit),
            });
            onAccountCreated(newAccount);
            setCustomerName("");
            setInitialDeposit("");
        } catch (err) {
            alert(err.message || "Failed to create account");
        }
    };

    return( 
        <div className="card">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <input
                    type = "number"
                    placeholder="Initial Deposit"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">
                        Create
                    </button>
            </form>
        </div>
    );
}

export default CreateAccount;