const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuarioRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const especialidadeRoutes = require('./routes/especialidadeRoutes');
const medicoRoutes = require('./routes/medicoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/consultas', consultaRoutes);
app.use('/especialidades', especialidadeRoutes);
app.use('/medicos', medicoRoutes);

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
