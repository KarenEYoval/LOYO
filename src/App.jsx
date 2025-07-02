import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import VistaLogin from "./views/VistaLogin";
import VistaJefe from "./views/VistaJefe";
import VistaEmpleado from "./views/VistaEmpleado";

function App() {
  const location = useLocation();
  const estaEnLogin = location.pathname === "/";
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
  }, []);

  return (
    <>
      {usuario && !estaEnLogin && (
        <nav
          style={{
            padding: "1rem",
            background: "#eee",
            display: "flex",
            gap: "1rem",
          }}
        >
          {usuario === "jefe" && <Link to="/jefe">Panel Jefe</Link>}
          {usuario === "empleado" && <Link to="/empleado">Panel Empleado</Link>}
          <button
            onClick={() => {
              setUsuario(null);
              localStorage.removeItem("usuario");
            }}
          >
            Cerrar sesión
          </button>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<VistaLogin setUsuario={setUsuario} />} />
        <Route
          path="/jefe"
          element={
            usuario === "jefe" ? (
              <VistaJefe />
            ) : (
              <VistaLogin setUsuario={setUsuario} />
            )
          }
        />
        <Route
          path="/empleado"
          element={
            usuario === "empleado" ? (
              <VistaEmpleado />
            ) : (
              <VistaLogin setUsuario={setUsuario} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
