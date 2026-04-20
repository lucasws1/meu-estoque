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
  const conn = await pool.getConnection();
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

    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO produtos (nome, preco_custo, preco_venda, quantidade_estoque) VALUES (?, ?, ?, ?)`,
      [nome, preco_custo, preco_venda, quantidade_estoque],
    );

    const produtoId = result.insertId;

    if (quantidade_estoque > 0) {
      await conn.query(
        `INSERT INTO movimentacoes (produto_id, tipo, quantidade, preco_unitario, observacao) VALUES (?, 'entrada', ?, ?, ?)`,
        [
          produtoId,
          quantidade_estoque,
          preco_venda,
          "Estoque inicial do produto",
        ],
      );
    }

    await conn.commit();

    const [rows] = await conn.query("SELECT * FROM produtos WHERE id = ?", [
      produtoId,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
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
