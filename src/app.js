const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api/usuarios', usuarioRoutes);

// Manejo de errores
app.use(errorHandler);

module.exports = app;