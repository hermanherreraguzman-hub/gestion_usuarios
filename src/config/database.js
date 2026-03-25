const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    try {
      // Crear directorio de datos si no existe
      const dataDir = path.join(__dirname, '../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('Directorio de datos creado:', dataDir);
      }

      const dbPath = path.join(dataDir, 'usuarios.db');
      console.log('Intentando abrir base de datos en:', dbPath);

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error al abrir la base de datos:', err);
          // Intentar con base de datos en memoria como fallback
          console.log('Usando base de datos en memoria como fallback');
          this.db = new sqlite3.Database(':memory:');
          this.createTable();
        } else {
          console.log('Base de datos conectada exitosamente en:', dbPath);
          this.createTable();
        }
      });
    } catch (error) {
      console.error('Error crítico al inicializar la base de datos:', error);
      // Fallback a memoria
      this.db = new sqlite3.Database(':memory:');
      this.createTable();
    }
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        edad INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error al crear tabla:', err);
      } else {
        console.log('Tabla usuarios lista');
        
        // Insertar datos de prueba (opcional)
        this.insertTestData();
      }
    });
  }

  insertTestData() {
    // Verificar si hay datos
    this.db.get('SELECT COUNT(*) as count FROM usuarios', (err, row) => {
      if (err) return;
      if (row.count === 0) {
        const testUsers = [
          ['Juan Pérez', 'juan@example.com', 25],
          ['María García', 'maria@example.com', 30],
          ['Carlos López', 'carlos@example.com', 35]
        ];
        
        testUsers.forEach(user => {
          this.db.run(
            'INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)',
            user,
            (err) => {
              if (err && !err.message.includes('UNIQUE')) {
                console.error('Error insertando datos de prueba:', err);
              }
            }
          );
        });
        console.log('Datos de prueba insertados');
      }
    });
  }

  getConnection() {
    return this.db;
  }
}

const database = new Database();
module.exports = database.getConnection();