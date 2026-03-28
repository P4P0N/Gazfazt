const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Obtener usuarios
app.get('/usuarios', (req, res) => {
  const data = fs.readFileSync('usuarios.json');
  const usuarios = JSON.parse(data);
  res.json(usuarios);
});

// Guardar usuario
app.post('/usuarios', (req, res) => {
  const data = fs.readFileSync('usuarios.json');
  const usuarios = JSON.parse(data);

  const nuevoUsuario = req.body;
  usuarios.push(nuevoUsuario);

  fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2));

  res.json({ mensaje: "Usuario guardado" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

// LOGIN
app.post('/login', (req, res) => {
  const data = fs.readFileSync('usuarios.json');
  const usuarios = JSON.parse(data);

  const { correo } = req.body;

  const usuario = usuarios.find(u => u.correo === correo);

  if (usuario) {
    res.json({ mensaje: "Login correcto", usuario });
  } else {
    res.json({ mensaje: "Usuario no encontrado" });
  }
});