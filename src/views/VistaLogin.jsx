import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function VistaLogin({ setUsuario }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("empleado");

  const auth = getAuth();
  const navigate = useNavigate();

  const loginConEmail = async () => {
    if (!email || !password) {
      alert("Por favor ingresa correo y contraseña");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUsuario(rol);
      localStorage.setItem("usuario", rol);

      if (rol === "jefe") {
        navigate("/jefe");
      } else if (rol === "empleado") {
        navigate("/empleado");
      }
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
       
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          color: "0a0a0a",
          marginBottom: "2rem",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
        }}
      >
         TIENDA LOYO
      </h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "10px",
          minWidth: "500px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        >
          <option value="empleado">Empleado</option>
          <option value="jefe">Jefe</option>
        </select>
        <button
          onClick={loginConEmail}
          style={{
            padding: "0.7rem",
            fontSize: "1.1rem",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

export default VistaLogin;
