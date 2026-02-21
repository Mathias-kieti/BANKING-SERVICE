import "./styles.css";
import React, { useEffect, useState } from "react";
import { getAccounts } from "./api";
import CreateAccount from "./components/CreateAccount";
import AccountList from "./components/AccountList";

function App() {
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Backend not running yet");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <>
      <header className="top-bar">
        <div className="container">
          <h1>Banking Operating System</h1>
        </div>
      </header>

      <div className="container">
        <CreateAccount onAccountCreated={fetchAccounts} />
        <AccountList accounts={accounts} refreshAccounts={fetchAccounts} />
      </div>
    </>
  );
}

export default App;