const { body } = require('express-validator');

const validateUsuario = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
    .trim()
    .escape(),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('edad')
    .optional()
    .isInt({ min: 0, max: 120 }).withMessage('La edad debe ser un número entre 0 y 120')
    .toInt()
];

module.exports = { validateUsuario };