import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function VistaAgregarProducto() {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    cantidad: "",
    precioOriginal: "",
    costoFinal: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { codigo, nombre, cantidad, precioOriginal, costoFinal } = form;

    if (!codigo || !nombre || !cantidad || !precioOriginal || !costoFinal) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      // Verificar si el código ya existe en MySQL
      const resCheck = await fetch(`http://localhost:5000/productos`);
      const data = await resCheck.json();
      const existeCodigo = data.some((p) => p.codigo === codigo);

      if (existeCodigo) {
        alert("El código ya está registrado. Usa otro código diferente.");
        setLoading(false);
        return;
      }

      // Agregar producto en MySQL
      const res = await fetch("http://localhost:5000/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo,
          nombre: nombre.trim(),
          cantidad: parseInt(cantidad, 10),
          precioOriginal: parseFloat(precioOriginal),
          costoFinal: parseFloat(costoFinal),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      alert("Producto agregado con éxito");
      navigate("/inventario");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar producto: " + error.message);
    }

    setLoading(false);
  };

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
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Agregar Producto</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input type="text" name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} required />
          <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
          <input type="number" name="cantidad" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} required min={1} />
          <input type="number" name="precioOriginal" placeholder="Costo" value={form.precioOriginal} onChange={handleChange} required min={0} step="0.01" />
          <input type="number" name="costoFinal" placeholder="Precio Cliente" value={form.costoFinal} onChange={handleChange} required min={0} step="0.01" />

          <button type="submit" disabled={loading} style={{ backgroundColor: "#4a90e2", color: "white", padding: "0.75rem", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold" }}>
            {loading ? "Guardando..." : "Guardar Producto"}
          </button>
          <button type="button" onClick={() => navigate("/inventario")} style={{ backgroundColor: "#ccc", color: "black", padding: "0.75rem", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default VistaAgregarProducto;
