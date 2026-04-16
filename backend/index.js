require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const authRoutes = require("./src/routes/auth");
const produtosRoutes = require("./src/routes/produtos");
const movimentacoesRoutes = require("./src/routes/movimentacoes");
app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/movimentacoes", movimentacoesRoutes);

// Handler de erros genéricos
app.use((err, _req, res, _next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Ocorreu um erro interno." });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
