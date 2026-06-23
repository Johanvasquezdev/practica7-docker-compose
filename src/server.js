const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root_password',
  database: process.env.DB_NAME || 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let dbPool;

// Inicialización de la base de datos con reintentos
async function initDbConnection() {
  let retries = 15;
  while (retries > 0) {
    try {
      console.log(`[DB] Intentando conectar a MySQL (Reintentos restantes: ${retries})...`);
      dbPool = mysql.createPool(dbConfig);
      // Validar conexión obteniendo un cliente del pool
      const conn = await dbPool.getConnection();
      console.log('[DB] Conexión establecida con éxito.');
      conn.release();
      return;
    } catch (err) {
      console.error(`[DB] Error de conexión: ${err.message}. Reintentando en 3 segundos...`);
      retries--;
      if (retries === 0) {
        console.error('[DB] Error fatal: No se pudo conectar a la base de datos después de varios intentos.');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Rutas de la API
app.get('/api/contacts', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener contactos:', err);
    res.status(500).json({ error: 'Error al obtener la lista de contactos.' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  // Validación básica del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El correo electrónico no es válido.' });
  }

  try {
    const [result] = await dbPool.query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), message.trim()]
    );
    res.status(201).json({
      message: 'Contacto guardado con éxito.',
      contactId: result.insertId
    });
  } catch (err) {
    console.error('Error al guardar el contacto:', err);
    res.status(500).json({ error: 'Error interno del servidor al guardar el contacto.' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const conn = await dbPool.getConnection();
    conn.release();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: err.message });
  }
});

// Arrancar servidor
async function startServer() {
  await initDbConnection();
  app.listen(PORT, () => {
    console.log(`[Server] Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

startServer();
