import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Obtener todos los productos
router.get("/", (req, res) => {
  db.query("SELECT * FROM productos", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Agregar producto
router.post("/", (req, res) => {
  const { codigo, nombre, cantidad, precioOriginal, costoFinal } = req.body;
  const sql = "INSERT INTO productos (codigo, nombre, cantidad, precioOriginal, costoFinal) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [codigo, nombre, cantidad, precioOriginal, costoFinal], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, message: "Producto agregado" });
  });
});

// Actualizar producto
router.put("/:id", (req, res) => {
  const { cantidad } = req.body;
  db.query("UPDATE productos SET cantidad = ? WHERE id = ?", [cantidad, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Cantidad actualizada" });
  });
});

// Eliminar producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  });
});

export default router;
