import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Registrar una venta
router.post("/", (req, res) => {
  const { productoId, nombre, cantidadVendida, precioUnitario } = req.body;

  const totalVenta = Number(precioUnitario) * Number(cantidadVendida);

  const sql = `
    INSERT INTO ventas (productoId, nombre, cantidadVendida, precioUnitario, totalVenta)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [productoId, nombre, cantidadVendida, precioUnitario, totalVenta], (err) => {
    if (err) return res.status(500).json({ error: err });

    // Actualiza la cantidad en productos
    const sqlUpdate = "UPDATE productos SET cantidad = cantidad - ? WHERE id = ?";
    db.query(sqlUpdate, [cantidadVendida, productoId], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ message: "Venta registrada correctamente" });
    });
  });
});

// Obtener todas las ventas
router.get("/", (req, res) => {
  const sql = "SELECT * FROM ventas ORDER BY fecha DESC";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
});

export default router;
