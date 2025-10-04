import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function VistaLogin({ setUsuario }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginConMySQL = async () => {
    if (!email || !password) {
      alert("Por favor ingresa correo y contraseña");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      const data = await res.json();
      setUsuario(data.rol);
      localStorage.setItem("usuario", data.rol);

      // Redirigir según el rol
      if (data.rol === "jefe") navigate("/jefe");
      else if (data.rol === "empleado") navigate("/empleado");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem" }}>TIENDA LOYO</h1>
      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "10px", minWidth: "500px", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
        <h2 style={{ textAlign: "center", margin: 0 }}>Iniciar sesión</h2>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "0.5rem", fontSize: "1rem" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "0.5rem", fontSize: "1rem" }} />
        <button onClick={loginConMySQL} style={{ padding: "0.7rem", fontSize: "1.1rem", backgroundColor: "#4a90e2", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          Entrar
        </button>
      </div>
    </div>
  );
}

export default VistaLogin;
