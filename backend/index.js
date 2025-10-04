const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",  // tu contraseña
  database: "LOYO",     // tu base de datos
});

db.connect((err) => {
  if (err) console.error("❌ Error al conectar:", err);
  else console.log("✅ Conectado a MySQL");
});

// Endpoint login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ mensaje: "Faltan datos" });

  db.query(
    "SELECT rol FROM usuarios WHERE email=? AND password=?",
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ mensaje: "Error en la base de datos" });

      if (results.length === 0) {
        return res.status(401).json({ mensaje: "Credenciales incorrectas" });
      }

      res.json({ rol: results[0].rol });
    }
  );
});

// Endpoint agregar producto
// Agregar producto
app.post("/productos", (req, res) => {
  const { codigo, nombre, cantidad, precioOriginal, costoFinal } = req.body;

  if (!codigo || !nombre || !cantidad || !precioOriginal || !costoFinal) {
    return res.status(400).json({ mensaje: "Faltan datos" });
  }

  db.query(
    "INSERT INTO productos (codigo, nombre, cantidad, precioOriginal, costoFinal) VALUES (?, ?, ?, ?, ?)",
    [codigo, nombre, cantidad, precioOriginal, costoFinal],
    (err, result) => {
      if (err) return res.status(500).json({ mensaje: "Error al agregar producto" });

      res.json({ id: result.insertId, codigo, nombre, cantidad, precioOriginal, costoFinal });
    }
  );
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
