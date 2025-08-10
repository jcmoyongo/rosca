import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Success! Token: ${data.token}`);
      } else {
        setMessage(`❌ Error: ${data.error || "Registration failed"}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Register for ROSCA</h2>
      <form onSubmit={handleSubmit}>
        <input id="name" placeholder="Name" onChange={handleChange} required /><br />
        <input id="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input id="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
