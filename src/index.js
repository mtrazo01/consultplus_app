const express = require('express');
const cors = require('cors');
const app = express();

const usuarioRoutes = require('./routes/usuarioRoutes');
const consultaRoutes = require('./routes/consultaRoutes'); // 👈 Aqui
const especialidadeRoutes = require('./routes/especialidadeRoutes');
const medicoRoutes = require('./routes/medicoRoutes');

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/consultas', consultaRoutes);
app.use('/especialidades', especialidadeRoutes);
app.use('/medicos', medicoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
