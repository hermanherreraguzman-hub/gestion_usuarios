const db = require('../config/database');

class UsuarioModel {
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM usuarios ORDER BY id DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(usuario) {
    const { nombre, email, edad } = usuario;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)',
        [nombre, email, edad || null],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  }

  static update(id, usuario) {
    const { nombre, email, edad } = usuario;
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE usuarios SET nombre = ?, email = ?, edad = ? WHERE id = ?',
        [nombre, email, edad || null, id],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM usuarios WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = UsuarioModel;