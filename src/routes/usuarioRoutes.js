const express = require('express');
const router = express.Router();

// Import correto do controller
const {
  criarUsuario,
  loginUsuario,
  atualizarUsuario,
  excluirUsuario
} = require('../controllers/usuarioController'); 

// Rotas de usuário
router.post('/', criarUsuario);           
router.post('/login', loginUsuario);      
router.put('/:id', atualizarUsuario);     
router.delete('/:id', excluirUsuario);   

module.exports = router;
