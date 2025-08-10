import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Logged in!`);
        localStorage.setItem("token", data.token);         // ✅ store token
        localStorage.setItem("userId", data.userId);       // optional
        onLogin(); // ✅ tell App to switch to dashboard
      } else {
        setMessage(`❌ ${data.error || "Login failed"}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
  <div style={{ maxWidth: "400px", margin: "auto" }}>
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input id="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
      <input id="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
      <button type="submit">Login</button>
    </form>
    <p>{message}</p>
  </div>
  );
}