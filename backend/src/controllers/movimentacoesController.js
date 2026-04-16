const pool = require("../config/db");

const TIPOS_VALIDOS = ["entrada", "saida"];

// GET /api/
exports.listarMovimentacoes = async (req, res, next) => {
  try {
    const { tipo, nome_produto } = req.query;

    if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
      return res
        .status(400)
        .json({ error: 'Tipo inválido. Use "entrada" ou "saida".' });
    }

    let sql = `SELECT m.*, p.nome AS nome_produto
               FROM movimentacoes m
               JOIN produtos p ON m.produto_id = p.id
               WHERE 1=1`;

    const params = [];

    if (tipo) {
      sql += " AND m.tipo = ?";
      params.push(tipo);
    }

    if (nome_produto) {
      sql += " AND p.nome LIKE ?";
      params.push(`%${nome_produto}%`);
    }

    sql += " ORDER BY m.data_movimentacao DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/movimentacoes/:id
exports.buscarMovimentacao = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, p.nome AS nome_produto
       FROM movimentacoes m
       JOIN produtos p ON m.produto_id = p.id
       WHERE m.id = ?`,
      [req.params.id],
    );

    if (!rows.length)
      return res.status(404).json({ error: "Movimentação não encontrada." });

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /api/movimentacoes
exports.criarMovimentacao = async (req, res, next) => {
  try {
    const { produto_id, tipo, quantidade, preco_unitario } = req.body;

    if (!produto_id)
      return res
        .status(400)
        .json({ error: 'Campo "produto_id" é obrigatório' });

    if (!tipo)
      return res.status(400).json({ error: 'Campo "tipo" é obrigatório' });
    else if (!TIPOS_VALIDOS.includes(tipo))
      return res
        .status(400)
        .json({ error: 'Tipo inválido. Use "entrada" ou "saida".' });

    if (!quantidade)
      return res
        .status(400)
        .json({ error: 'Campo "quantidade" é obrigatório' });

    if (!preco_unitario)
      return res
        .status(400)
        .json({ error: 'Campo "preco_unitario" é obrigatório' });

    const [result] = await pool.query(
      `INSERT INTO movimentacoes (produto_id, tipo, quantidade, preco_unitario) VALUES (?, ?, ?, ?, ?)`,
      [produto_id, tipo, quantidade, preco_unitario],
    );

    const [rows] = await pool.query(
      `SELECT m.*, p.nome AS nome_produto
       FROM movimentacoes m
       JOIN produtos p ON m.produto_id = p.id
       WHERE m.id = ?`,
      [result.insertId],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.atualizarMovimentacao = async (req, res, next) => {
  try {
    const [existing] = await pool.query(
      `SELECT * FROM movimentacoes WHERE id = ?`,
      [req.params.id],
    );

    if (!existing.length)
      return res.status(404).json({ error: "Movimentação não encontrada." });

    const movimentacao = existing[0];

    const produto_id = req.body.produto_id || movimentacao.produto_id;
    const tipo = req.body.tipo || movimentacao.tipo;
    const quantidade = req.body.quantidade || movimentacao.quantidade;
    const preco_unitario =
      req.body.preco_unitario || movimentacao.preco_unitario;

    if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
      return res
        .status(400)
        .json({ error: 'Tipo inválido. Use "entrada" ou "saida".' });
    }

    await pool.query(
      `UPDATE movimentacoes SET produto_id = ?, tipo = ?, quantidade = ?, preco_unitario = ? WHERE id = ?`,
      [produto_id, tipo, quantidade, preco_unitario, req.params.id],
    );

    const [rows] = await pool.query(
      `SELECT m.*, p.nome AS nome_produto
       FROM movimentacoes m
       JOIN produtos p ON m.produto_id = p.id
       WHERE m.id = ?`,
      [req.params.id],
    );

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deletarMovimentacao = async (req, res, next) => {
  try {
    const [existing] = await pool.query(
      `SELECT * FROM movimentacoes WHERE id = ?`,
      [req.params.id],
    );

    if (!existing.length)
      return res.status(404).json({ error: "Movimentação não encontrada." });

    await pool.query(`DELETE FROM movimentacoes WHERE id = ?`, [req.params.id]);

    res.json({ message: "Movimentação deletada com sucesso." });
  } catch (error) {
    next(error);
  }
};
