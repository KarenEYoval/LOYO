import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

function VistaInventario() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    cantidad: "",
    precio: "",
    horaVenta: "",
    vendidoA: "",
  });
  const [loading, setLoading] = useState(false);

  // Cargar productos para mostrar y para select de código
  useEffect(() => {
    const fetchProductos = async () => {
      const productosRef = collection(db, "productos");
      const snapshot = await getDocs(productosRef);
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(docs);
    };

    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.codigo || !form.nombre || !form.cantidad || !form.precio || !form.horaVenta || !form.vendidoA) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      const nuevoProducto = {
        codigo: form.codigo,
        nombre: form.nombre.trim(),
        cantidad: parseInt(form.cantidad, 10),
        precio: parseFloat(form.precio),
        horaVenta: form.horaVenta, // Guardamos tal cual el datetime-local
        vendidoA: form.vendidoA.trim(),
      };

      const productosRef = collection(db, "productos");
      const docRef = await addDoc(productosRef, nuevoProducto);

      setProductos((prev) => [...prev, { id: docRef.id, ...nuevoProducto }]);

      setForm({
        codigo: "",
        nombre: "",
        cantidad: "",
        precio: "",
        horaVenta: "",
        vendidoA: "",
      });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar el producto.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#c8f7c5",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>Bienvenida jefa</h1>

      {/* Formulario para agregar producto */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "1rem 2rem",
          borderRadius: "10px",
          maxWidth: "800px",
          width: "100%",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <h2 style={{ gridColumn: "1 / -1", marginBottom: "1rem" }}>Agregar producto vendido</h2>

        <label>
          Código*:
          <select
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          >
            <option value="">Selecciona un código</option>
            {productos.map((p) => (
              <option key={p.id} value={p.codigo || p.id}>
                {p.nombre} — Código: {p.codigo || p.id}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nombre*:
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre del producto vendido"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Cantidad*:
          <input
            type="number"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
            min="1"
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Precio*:
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Hora de venta*:
          <input
            type="datetime-local"
            name="horaVenta"
            value={form.horaVenta}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Vendido a*:
          <input
            type="text"
            name="vendidoA"
            value={form.vendidoA}
            onChange={handleChange}
            placeholder="Nombre del cliente"
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#68b684",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Guardando..." : "Agregar Producto"}
          </button>
        </div>
      </form>

      {/* Tabla de productos */}
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
              <th>Precio</th>
              <th>Hora de venta</th>
              <th>Vendido a</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo || "—"}</td>
                <td>{p.nombre}</td>
                <td>{p.cantidad}</td>
                <td>${p.precio}</td>
                <td>{p.horaVenta ? new Date(p.horaVenta).toLocaleString() : "—"}</td>
                <td>{p.vendidoA || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VistaJefe;
