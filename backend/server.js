import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js"; // asegúrate de que tu conexión a MySQL esté correcta

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// Login
// --------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ mensaje: "Ingresa correo y contraseña" });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error interno", error: err });
    if (results.length === 0)
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    res.json({ rol: results[0].rol, mensaje: "Inicio exitoso" });
  });
});

// --------------------
// Productos
// --------------------
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener productos", error: err });
    res.json(results);
  });
});

app.post("/productos", (req, res) => {
  const { codigo, nombre, cantidad, precioOriginal, costoFinal } = req.body;
  if (!codigo || !nombre || cantidad == null || precioOriginal == null || costoFinal == null) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  const sqlCheck = "SELECT * FROM productos WHERE codigo = ?";
  db.query(sqlCheck, [codigo], (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al consultar la base", error: err });
    if (results.length > 0) return res.status(400).json({ mensaje: "Código ya registrado" });

    const sqlInsert = `
      INSERT INTO productos (codigo, nombre, cantidad, precioOriginal, costoFinal)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sqlInsert, [codigo, nombre, cantidad, precioOriginal, costoFinal], (err2, results2) => {
      if (err2) return res.status(500).json({ mensaje: "Error al insertar producto", error: err2 });
      res.status(201).json({ mensaje: "Producto agregado con éxito", id: results2.insertId });
    });
  });
});

app.patch("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  if (cantidad == null) return res.status(400).json({ mensaje: "Falta cantidad a actualizar" });

  const sqlUpdate = "UPDATE productos SET cantidad = ? WHERE id = ?";
  db.query(sqlUpdate, [cantidad, id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al actualizar stock", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ mensaje: "Stock actualizado con éxito" });
  });
});

app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM productos WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al eliminar producto", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ mensaje: "Producto eliminado con éxito" });
  });
});

// --------------------
// Ventas
// --------------------
// Registrar venta
app.post("/ventas", (req, res) => {
  const { productoId, nombre, cantidadVendida, precioUnitario, totalVenta } = req.body;
  if (!productoId || cantidadVendida == null || precioUnitario == null || !totalVenta) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  const sqlInsert = `
    INSERT INTO ventas (productoId, nombre, cantidadVendida, precioUnitario, totalVenta, fecha)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  db.query(sqlInsert, [productoId, nombre, cantidadVendida, precioUnitario, totalVenta], (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al registrar la venta", error: err });
    res.status(201).json({ mensaje: "Venta registrada con éxito", id: results.insertId });
  });
});

// Obtener historial de ventas
app.get("/ventas", (req, res) => {
  const sql = `
    SELECT id, productoId, nombre, cantidadVendida, precioUnitario, totalVenta, fecha
    FROM ventas
    ORDER BY fecha DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener ventas", error: err });
    res.json(results);
  });
});

// Obtener historial completo (historial_ventas)
app.get("/historial-ventas", (req, res) => {
  const sql = `
    SELECT id, producto_id, nombre, cantidad, precio_unitario, total, fecha
    FROM historial_ventas
    ORDER BY fecha DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener historial de ventas:", err);
      return res.status(500).json({ mensaje: "Error al obtener historial de ventas", error: err });
    }
    res.json(results);
  });
});

// --------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en http://localhost:${PORT}`));
