import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Inicio de sesión simple
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ message: "Credenciales incorrectas" });
    res.json(results[0]);
  });
});

export default router;
