import { useState, useEffect } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>ROSCA App</h1>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <>
          <RegisterForm />
          <hr style={{ margin: "2rem" }} />
          <LoginForm onLogin={() => setIsLoggedIn(true)} />
        </>
      )}
    </div>
  );
}

export default App;
