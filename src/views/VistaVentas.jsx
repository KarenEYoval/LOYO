import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function VistaVentas() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  // Obtener productos
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

  // Manejo de cambios en cantidad
  const handleCantidadChange = (id, value) => {
    const cantidadValida = value === "" ? "" : Math.max(0, parseInt(value, 10) || 0);
    setCantidades((prev) => ({ ...prev, [id]: cantidadValida }));
  };

  // Registrar ventas y actualizar stock
  const registrarVentasGenerales = async () => {
    const productosAVender = productos.filter((p) => cantidades[p.id] > 0);

    if (productosAVender.length === 0) {
      alert("No hay productos con cantidades válidas.");
      return;
    }

    try {
      for (const producto of productosAVender) {
        const cantidadVendida = cantidades[producto.id];
        const precioUnitario = Number(producto.costoFinal || producto.precioOriginal || 0);

        // Registrar venta
        await fetch(`${API_URL}/ventas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            producto_id: producto.id,
            nombre: producto.nombre,
            cantidad: cantidadVendida,
            precioUnitario,
          }),
        });

        // Actualizar stock
        const nuevaCantidad = producto.cantidad - cantidadVendida;
        await fetch(`${API_URL}/productos/${producto.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cantidad: nuevaCantidad }),
        });
      }

      alert("Ventas registradas con éxito");
      setCantidades({});

      // Recargar productos
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al registrar ventas:", error);
      alert("Error al registrar las ventas");
    }
  };

  const limpiarCarrito = () => setCantidades({});

  // Calcular total general
  const totalGeneral = productos.reduce((acc, producto) => {
    const cantidad = cantidades[producto.id] || 0;
    const precioUnitario = Number(producto.costoFinal || producto.precioOriginal || 0);
    return acc + cantidad * precioUnitario;
  }, 0);

  // Carrito de venta
  const carrito = productos
    .filter((p) => cantidades[p.id] > 0)
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      cantidad: cantidades[p.id],
      precioUnitario: Number(p.costoFinal || p.precioOriginal || 0),
      total: cantidades[p.id] * Number(p.costoFinal || p.precioOriginal || 0),
    }));

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "3rem",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        width: "90%",
        maxWidth: "1200px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "auto",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        {/* Botón regresar */}
        <button onClick={() => navigate("/jefe")} style={{
          width: "120px",
          padding: "0.5rem 1rem",
          backgroundColor: "#68b684",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          alignSelf: "flex-start"
        }}>
          Regresar
        </button>

        <h1 style={{ fontSize: "2rem", textAlign: "center" }}>Vista de Ventas</h1>
        <p style={{ textAlign: "center" }}>Aquí puedes registrar cuántos productos se han vendido.</p>

        {/* Lista de productos */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {productos.map((p) => (
            <li key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 1rem", borderBottom: "1px solid #ccc" }}>
              <span>{p.nombre} - ${Number(p.costoFinal || p.precioOriginal || 0).toFixed(2)}</span>
              <input
                type="number"
                min="0"
                value={cantidades[p.id] || ""}
                onChange={(e) => handleCantidadChange(p.id, e.target.value)}
                placeholder="Cantidad"
                style={{ width: "80px", padding: "0.3rem" }}
              />
            </li>
          ))}
        </ul>

        {/* Resumen de venta */}
        {carrito.length > 0 && (
          <div style={{ backgroundColor: "#f8f8f8", padding: "1.5rem", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h2 style={{ marginBottom: "1rem", color: "#4a90e2" }}>Resumen de Venta</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
                  <th style={{ padding: "0.5rem" }}>Producto</th>
                  <th style={{ padding: "0.5rem" }}>Cantidad</th>
                  <th style={{ padding: "0.5rem" }}>Precio</th>
                  <th style={{ padding: "0.5rem" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.5rem" }}>{item.nombre}</td>
                    <td style={{ padding: "0.5rem" }}>{item.cantidad}</td>
                    <td style={{ padding: "0.5rem" }}>${item.precioUnitario.toFixed(2)}</td>
                    <td style={{ padding: "0.5rem" }}>${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "#4a90e2" }}>TOTAL: ${totalGeneral.toFixed(2)}</h2>
        </div>

        {/* Botones de acción */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button onClick={registrarVentasGenerales} style={{ padding: "0.8rem 1.5rem", backgroundColor: "#4a90e2", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>Vender</button>
        </div>
        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
          <button onClick={limpiarCarrito} style={{ padding: "0.5rem 1rem", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>Limpiar Carrito</button>
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button onClick={() => navigate("/historial-ventas")} style={{ padding: "0.8rem 1.5rem", backgroundColor: "#333", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>Ver Historial de Ventas</button>
        </div>
      </div>
    </div>
  );
}

export default VistaVentas;
