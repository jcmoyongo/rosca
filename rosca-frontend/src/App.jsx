import { useState, useEffect } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import "./index.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // toggle forms

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setShowLogin(true); // back to login after logout
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">ROSCA App</h1>

      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <div className="w-full max-w-md">
          {showLogin ? (
            <div className="space-y-4">
              <LoginForm onLogin={() => setIsLoggedIn(true)} />
              <p className="text-center text-gray-700">
                Don’t have an account?{" "}
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-blue-600 hover:underline"
                >
                  Register
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <RegisterForm onRegister={() => setIsLoggedIn(true)} />
              <p className="text-center text-gray-700">
                Already have an account?{" "}
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
