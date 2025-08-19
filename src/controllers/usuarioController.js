exports.loginUsuario = async (req, res) => {
  const { cpf, senha } = req.body;
  console.log('Dados recebidos no login:', cpf, senha); // 👈 log útil
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
    console.error('Erro no loginUsuario:', err); // 👈 veja isso no terminal!
    res.status(500).json({ erro: err.message });
  }
};
