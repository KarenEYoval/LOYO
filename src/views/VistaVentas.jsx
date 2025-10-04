import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function VistaVentas() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/productos");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const handleCantidadChange = (id, value) => {
    setCantidades((prev) => ({ ...prev, [id]: value }));
  };

  const registrarVentasGenerales = async () => {
    const productosAVender = productos.filter((producto) => {
      const cantidad = parseInt(cantidades[producto.id], 10);
      return cantidad && cantidad > 0;
    });

    if (productosAVender.length === 0) {
      alert("No hay productos con cantidades válidas.");
      return;
    }

    try {
      for (const producto of productosAVender) {
        const cantidad = parseInt(cantidades[producto.id], 10);
        const precioUnitario =
          producto.costoFinal || producto.precioOriginal || producto.precio || 0;
        const total = precioUnitario * cantidad;

        await fetch("http://localhost:5000/ventas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productoId: producto.id,
            nombre: producto.nombre,
            cantidadVendida: cantidad,
            precioUnitario,
            totalVenta: total,
          }),
        });
      }

      alert("Ventas registradas con éxito");
      setCantidades({});
    } catch (error) {
      console.error("Error al registrar ventas:", error);
      alert("Error al registrar las ventas");
    }
  };

  const limpiarCarrito = () => setCantidades({});

  const totalGeneral = productos.reduce((acc, producto) => {
    const cantidad = parseInt(cantidades[producto.id], 10);
    if (!cantidad || cantidad <= 0) return acc;
    const precioUnitario =
      producto.costoFinal || producto.precioOriginal || producto.precio || 0;
    return acc + cantidad * precioUnitario;
  }, 0);

  const carrito = productos
    .filter((producto) => parseInt(cantidades[producto.id], 10) > 0)
    .map((producto) => {
      const cantidad = parseInt(cantidades[producto.id], 10);
      const precioUnitario =
        producto.costoFinal || producto.precioOriginal || producto.precio || 0;
      return { id: producto.id, nombre: producto.nombre, cantidad, precioUnitario, total: cantidad * precioUnitario };
    });

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "3rem", boxShadow: "0 10px 20px rgba(0,0,0,0.15)", width: "90%", maxWidth: "1200px", display: "flex", flexDirection: "column", gap: "2rem", margin: "auto", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={() => navigate("/jefe")} style={{ width: "120px", padding: "0.5rem 1rem", backgroundColor: "#68b684", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold", alignSelf: "flex-start" }}>Regresar</button>

        <h1 style={{ fontSize: "2rem", textAlign: "center" }}>Vista de Ventas</h1>
        <p style={{ textAlign: "center" }}>Aquí puedes registrar cuántos productos se han vendido.</p>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {productos.map((producto) => (
            <li key={producto.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 1rem", borderBottom: "1px solid #ccc" }}>
              <span>{producto.nombre} - ${producto.costoFinal || producto.precioOriginal || producto.precio}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="number" min="1" value={cantidades[producto.id] || ""} onChange={(e) => handleCantidadChange(producto.id, e.target.value)} placeholder="Cantidad" style={{ width: "80px", padding: "0.3rem" }} />
              </div>
            </li>
          ))}
        </ul>

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
