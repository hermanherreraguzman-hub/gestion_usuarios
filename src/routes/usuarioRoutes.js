const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validateUsuario } = require('../middlewares/validation');

router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.getById);
router.post('/', validateUsuario, usuarioController.create);
router.put('/:id', validateUsuario, usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;