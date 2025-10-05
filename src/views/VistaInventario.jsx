import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function VistaInventario() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  // Cargar productos desde backend MySQL
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${API_URL}/productos`);
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Eliminar producto
  const handleEliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este producto?"
    );
    if (!confirmar) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
        method: "DELETE",
      });

      setProductos(productos.filter((producto) => producto.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error al eliminar el producto.");
    }
  };

  // Editar producto
  const handleEditarProducto = (id) => {
    navigate(`/editar-producto/${id}`);
  };

  // Filtrado y ordenamiento
  const productosFiltrados = productos
    .filter((p) => {
      const texto = busqueda.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(texto) ||
        (p.codigo && p.codigo.toLowerCase().includes(texto))
      );
    })
    .sort((a, b) => {
      const aNum = parseInt(a.codigo, 10);
      const bNum = parseInt(b.codigo, 10);
      if (isNaN(aNum)) return 1;
      if (isNaN(bNum)) return -1;
      return aNum - bNum;
    });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "3rem",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => navigate("/jefe")}
            style={{
              width: "120px",
              padding: "0.5rem 1rem",
              backgroundColor: "#68b684",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Regresar
          </button>

          <button
            onClick={() => navigate("/agregar-producto")}
            style={{
              width: "160px",
              padding: "0.5rem 1rem",
              backgroundColor: "#4a90e2",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Agregar Producto
          </button>
        </div>

        <h1 style={{ fontSize: "2rem", margin: 0, textAlign: "center" }}>
          Bienvenida Jefa
        </h1>
        <h2 style={{ fontSize: "2rem", margin: 0, textAlign: "center" }}>
          Inventario
        </h2>

        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por código o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
          }}
        />

        <div style={{ overflowX: "auto", width: "100%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              minWidth: "700px",
            }}
          >
            <thead style={{ backgroundColor: "#68b684", color: "#fff" }}>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Costo</th>
                <th>Precio cliente</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo || "—"}</td>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precioOriginal || "—"}</td>
                  <td>${p.costoFinal || "—"}</td>
                  <td>
                    <button
                      onClick={() => handleEditarProducto(p.id)}
                      style={{
                        backgroundColor: "#f0ad4e",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.3rem 0.6rem",
                        marginRight: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarProducto(p.id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.3rem 0.6rem",
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {productosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VistaInventario;
