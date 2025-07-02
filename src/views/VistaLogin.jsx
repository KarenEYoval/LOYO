import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function VistaLogin({ setUsuario }) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("jefe"); // 'jefe' o 'empleado'

  // Dentro del componente, antes de handleLogin
  const usuariosValidos = [
    { nombre: "Jefa", password: "Rosalba", rol: "jefe" },
    { nombre: "Empleado", password: "Moldes", rol: "empleado" },
  ];

  const handleLogin = () => {
    const usuarioEncontrado = usuariosValidos.find(
      (user) =>
        user.nombre === nombre && user.password === password && user.rol === rol
    );

    if (usuarioEncontrado) {
      localStorage.setItem("usuario", usuarioEncontrado.rol);
      setUsuario(usuarioEncontrado.rol);

      if (usuarioEncontrado.rol === "jefe") {
        navigate("/jefe");
      } else {
        navigate("/empleado");
      }
    } else {
      alert("Usuario, contraseña o rol incorrecto");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <div className="input-container">
        <label htmlFor="nombre">Usuario</label>
        <input
          type="text"
          id="nombre"
          placeholder="Ingrese su usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="select-container">
        <label htmlFor="rol">Rol</label>
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="jefe">Jefe</option>
          <option value="empleado">Empleado</option>
        </select>
      </div>
      <button className="login-button" onClick={handleLogin}>
        Iniciar sesión
      </button>
    </div>
  );
}

export default VistaLogin;
