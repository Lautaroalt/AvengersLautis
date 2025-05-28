const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3001;


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_contraseña',
  database: 'ventas_avengers'
});


db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

app.use(express.json());

a
app.get('/', (req, res) => {
  res.send('¡Servidor backend en funcionamiento!');
});


app.get('/ventas', (req, res) => {
  db.query('SELECT * FROM ventas', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener ventas' });
      return;
    }
    res.json(results);
  });
});


app.post('/ventas', (req, res) => {
  const { vendedor, producto, cantidad, fecha } = req.body;
  const query = 'INSERT INTO ventas (vendedor, producto, cantidad, fecha) VALUES (?, ?, ?, ?)';
  db.query(query, [vendedor, producto, cantidad, fecha], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al registrar venta' });
      return;
    }
    res.status(201).json({ message: 'Venta registrada con éxito' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
