import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function VistaEditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    cantidad: "",
    precioOriginal: "",
    costoFinal: "",
  });

  // Cargar datos del producto desde backend MySQL
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await fetch(`http://localhost:5000/productos/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();

        setForm({
          codigo: data.codigo || "",
          nombre: data.nombre || "",
          cantidad: data.cantidad?.toString() || "",
          precioOriginal: data.precioOriginal?.toString() || "",
          costoFinal: data.costoFinal?.toString() || "",
        });
      } catch (error) {
        console.error("Error al cargar producto:", error);
        alert("Error al cargar el producto");
        navigate("/inventario");
      }
    };

    cargarProducto();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleActualizar = async () => {
    const { codigo, nombre, cantidad, precioOriginal, costoFinal } = form;

    if (!codigo || !nombre || !cantidad || !precioOriginal || !costoFinal) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo,
          nombre,
          cantidad: parseInt(cantidad, 10),
          precioOriginal: parseFloat(precioOriginal),
          costoFinal: parseFloat(costoFinal),
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      alert("Producto actualizado con éxito");
      navigate("/inventario");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el producto");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Editar Producto</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          name="codigo"
          placeholder="Código"
          value={form.codigo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={handleChange}
          min={1}
          required
        />
        <input
          type="number"
          step="0.01"
          name="precioOriginal"
          placeholder="Precio original"
          value={form.precioOriginal}
          onChange={handleChange}
          min={0}
          required
        />
        <input
          type="number"
          step="0.01"
          name="costoFinal"
          placeholder="Costo final"
          value={form.costoFinal}
          onChange={handleChange}
          min={0}
          required
        />

        <button
          onClick={handleActualizar}
          style={{
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            padding: "0.8rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Guardar Cambios
        </button>

        <button
          onClick={() => navigate("/inventario")}
          style={{
            backgroundColor: "#888",
            color: "white",
            border: "none",
            padding: "0.6rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default VistaEditarProducto;
