const pool = require("../config/db");

// GET /api/produtos?nome=X
exports.listarProdutos = async (req, res, next) => {
  try {
    const { nome } = req.query;

    let sql = `SELECT * FROM produtos WHERE 1=1`;

    const params = [];

    if (nome) {
      sql += " AND nome LIKE ?";
      params.push(`%${nome}%`);
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/produtos/:id
exports.buscarProduto = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM produtos WHERE id = ?`, [
      req.params.id,
    ]);

    if (!rows.length)
      return res.status(404).json({ error: "Produto não encontrado." });

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /api/produtos
exports.criarProduto = async (req, res, next) => {
  try {
    const { nome, preco_custo, preco_venda, quantidade_estoque } = req.body;

    if (!nome)
      return res.status(400).json({ error: 'Campo "nome" é obrigatório' });
    if (!preco_custo)
      return res
        .status(400)
        .json({ error: 'Campo "preco_custo" é obrigatório' });
    if (!preco_venda)
      return res
        .status(400)
        .json({ error: 'Campo "preco_venda" é obrigatório' });

    const [result] = await pool.query(
      `INSERT INTO produtos (nome, preco_custo, preco_venda, quantidade_estoque) VALUES (?, ?, ?, ?)`,
      [nome, preco_custo, preco_venda, quantidade_estoque],
    );

    const [rows] = await pool.query("SELECT * FROM produtos WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// PUT /api/produtos/:id
exports.atualizarProduto = async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT * FROM produtos WHERE id = ?", [
      req.params.id,
    ]);

    if (!existing.length)
      return res.status(404).json({ error: "Produto não encontrado." });

    const produto = existing[0];

    const nome = req.body.nome || produto.nome;
    const preco_custo = req.body.preco_custo || produto.preco_custo;
    const preco_venda = req.body.preco_venda || produto.preco_venda;
    const quantidade_estoque =
      req.body.quantidade_estoque ?? produto.quantidade_estoque;

    const [result] = await pool.query(
      `UPDATE produtos SET nome = ?, preco_custo = ?, preco_venda = ?, quantidade_estoque = ? WHERE id = ?`,
      [nome, preco_custo, preco_venda, quantidade_estoque, req.params.id],
    );

    const [rows] = await pool.query("SELECT * FROM produtos WHERE id = ?", [
      req.params.id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deletarProduto = async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT * FROM produtos WHERE id = ?", [
      req.params.id,
    ]);

    if (!existing.length)
      return res.status(404).json({ error: "Produto não encontrado." });

    await pool.query("DELETE FROM produtos WHERE id = ?", [req.params.id]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
