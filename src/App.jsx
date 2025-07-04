import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

import VistaLogin from "./views/VistaLogin";
import VistaJefe from "./views/VistaJefe";
import VistaInventario from "./views/VistaInventario";
import VistaVentas from "./views/VistaVentas";
import VistaAgregarProducto from "./views/VistaAgregarProducto.jsx";
import VistaRegistro from "./views/VistaRegistro.jsx";
import VistaEditarProducto from "./views/VistaEditarProducto.jsx";
import VistaHistorialVentas from "./views/VistaHistorialVentas";

import "./styles.css";

function App() {
  const location = useLocation();
  const estaEnLogin = location.pathname === "/";
  const estaEnVentas = location.pathname === "/ventas";
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUsuario(null);
      localStorage.removeItem("usuario");
    });
  };

  return (
    <>
      {/*}
      {usuario && !estaEnLogin && !estaEnVentas && (
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
          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
      )}*/}

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
        /*
        <Route
          path="/inventario"
          element={
            usuario === "jefe" ? (
              <VistaInventario />
            ) : (
              <VistaLogin setUsuario={setUsuario} />
            )
          }
        />
        <Route
          path="/ventas"
          element={
            usuario === "jefe" ? (
              <VistaVentas />
            ) : (
              <VistaLogin setUsuario={setUsuario} />
            )
          }
        />
        <Route
          path="/agregar-producto"
          element={
            usuario === "jefe" ? (
              <VistaAgregarProducto />
            ) : (
              <VistaLogin setUsuario={setUsuario} />
            )
          }
        />
        <Route path="/registro" element={<VistaRegistro />} />
        <Route
          path="/editar-producto/:id"
          element={
            usuario === "jefe" ? (
              <VistaEditarProducto />
            ) : (
              <VistaLogin setUsuario={setUsuario} />
            )
          }
        />
        <Route path="/historial-ventas" element={<VistaHistorialVentas />} />
      </Routes>
    </>
  );
}

export default App;
