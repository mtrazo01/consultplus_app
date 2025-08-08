const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.criarUsuario);     
router.post('/login', usuarioController.loginUsuario); 

module.exports = router;
