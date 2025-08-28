const db = require('../config/db');

async function criarUsuario(req, res) {
  const { nome, cpf, senha } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO usuarios (nome, cpf, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, cpf, senha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function loginUsuario(req, res) {
  const { cpf, senha } = req.body;
  try {
    const result = await db.query(
      'SELECT * FROM usuarios WHERE cpf = $1 AND senha = $2',
      [cpf, senha]
    );
    if (result.rows.length > 0) {
      res.json({ usuario: result.rows[0] });
    } else {
      res.status(401).json({ erro: 'CPF ou senha inválidos' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function atualizarUsuario(req, res) {
  const { id } = req.params;
  const { nome, cpf, senha } = req.body;
  try {
    const result = await db.query(
      'UPDATE usuarios SET nome = $1, cpf = $2, senha = $3 WHERE id = $4 RETURNING *',
      [nome, cpf, senha, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function excluirUsuario(req, res) {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = {
  criarUsuario,
  loginUsuario,
  atualizarUsuario,
  excluirUsuario
};
