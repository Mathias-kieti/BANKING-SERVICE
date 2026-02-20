const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/accounts";

export async function getAccounts(params) {
    try {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error("Failed to fetch accounts");
        return await res.json();
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
}

export async function createAccount(data) {
    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to create account");
        }
        return await res.json();
    } catch (error) {
        console.error("Error creating account:", error);
        throw error;
    }
}

export async function deposit(id, amount) {
    try {
        const res = await fetch(`${BASE_URL}/${id}/deposit`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ amount }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to deposit");
        }
        return await res.json();
    } catch (error) {
        console.error("Error depositing:", error);
        throw error;
    }
}

export async function withdraw(id, amount) {
    try {
        const res = await fetch(`${BASE_URL}/${id}/withdraw`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ amount }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to withdraw");
        }
        return await res.json();
    } catch (error) {
        console.error("Error withdrawing:", error);
        throw error;
    }
}

export async function suspendAccount(id) {
    try {
        const res = await fetch(`${BASE_URL}/${id}/suspend`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to suspend account");
        }
        return await res.json();
    } catch (error) {
        console.error("Error suspending account:", error);
        throw error;
    }
}

export async function unsuspendAccount(id) {
    try {
        const res = await fetch(`${BASE_URL}/${id}/unsuspend`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to unsuspend account");
        }
        return await res.json();
    } catch (error) {
        console.error("Error unsuspending account:", error);
        throw error;
    }
}
