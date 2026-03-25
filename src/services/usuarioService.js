const UsuarioModel = require('../models/usuarioModel');

class UsuarioService {
  async getAll() {
    return await UsuarioModel.findAll();
  }

  async getById(id) {
    const usuario = await UsuarioModel.findById(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    return usuario;
  }

  async create(usuarioData) {
    // Verificar si el email ya existe (opcional, la BD lanza error unique)
    try {
      return await UsuarioModel.create(usuarioData);
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        throw new Error('El email ya está registrado');
      }
      throw err;
    }
  }

  async update(id, usuarioData) {
    const result = await UsuarioModel.update(id, usuarioData);
    if (result.changes === 0) throw new Error('Usuario no encontrado');
    return { message: 'Usuario actualizado' };
  }

  async delete(id) {
    const result = await UsuarioModel.delete(id);
    if (result.changes === 0) throw new Error('Usuario no encontrado');
    return { message: 'Usuario eliminado' };
  }
}

module.exports = new UsuarioService();