import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function VistaRegistro({ setUsuario }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("empleado"); // rol local, sin Firebase

  const auth = getAuth();

  const registrarUsuario = async () => {
    if (!email || !password) {
      alert("Ingresa correo y contraseña");
      return;
    }

    try {
      // Crear usuario en Firebase Auth (solo email y password)
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Usuario registrado!");

      // Guardar el rol localmente en la app, por ejemplo:
      setUsuario(rol);
      localStorage.setItem("usuario", rol);

      // Limpia formulario si quieres
      setEmail("");
      setPassword("");
      setRol("empleado");
    } catch (error) {
      alert("Error al registrar usuario: " + error.message);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="empleado">Empleado</option>
        <option value="jefe">Jefe</option>
      </select>
      <button onClick={registrarUsuario}>Registrar</button>
    </div>
  );
}

export default VistaRegistro;
