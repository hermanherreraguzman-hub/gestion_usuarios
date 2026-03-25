const usuarioService = require('../services/usuarioService');
const { validationResult } = require('express-validator');

class UsuarioController {
  async getAll(req, res, next) {
    try {
      const usuarios = await usuarioService.getAll();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const usuario = await usuarioService.getById(req.params.id);
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nombre, email, edad } = req.body;
      const newUsuario = await usuarioService.create({ nombre, email, edad });
      res.status(201).json(newUsuario);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nombre, email, edad } = req.body;
      const result = await usuarioService.update(req.params.id, { nombre, email, edad });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await usuarioService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsuarioController();