const pool = require("../config/db");

const TIPOS_VALIDOS = ["entrada", "saida"];

// GET /api/
exports.listarMovimentacoes = async (req, res, next) => {
  try {
    const { tipo, nome_produto, produto_id, data_from, data_to } = req.query;

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

    if (produto_id) {
      sql += " AND m.produto_id = ?";
      params.push(produto_id);
    }

    if (data_from) {
      sql += " AND DATE(m.data_movimentacao) >= ?";
      params.push(data_from);
    }

    if (data_to) {
      sql += " AND DATE(m.data_movimentacao) <= ?";
      params.push(data_to);
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
    const {
      produto_id,
      tipo,
      quantidade,
      preco_unitario,
      data_movimentacao,
      observacao,
    } = req.body;

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

    const delta = tipo === "entrada" ? quantidade : -quantidade;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO movimentacoes (produto_id, tipo, quantidade, preco_unitario, data_movimentacao, observacao) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          produto_id,
          tipo,
          quantidade,
          preco_unitario,
          data_movimentacao || new Date(),
          observacao || "",
        ],
      );

      await conn.query(
        `UPDATE produtos SET quantidade_estoque = quantidade_estoque + ? WHERE id = ?`,
        [delta, produto_id],
      );

      await conn.commit();

      const [rows] = await conn.query(
        `SELECT m.*, p.nome AS nome_produto
         FROM movimentacoes m
         JOIN produtos p ON m.produto_id = p.id
         WHERE m.id = ?`,
        [result.insertId],
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
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
    const quantidade = Number(req.body.quantidade ?? movimentacao.quantidade);
    const preco_unitario = Number(
      req.body.preco_unitario ?? movimentacao.preco_unitario,
    );

    if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
      return res
        .status(400)
        .json({ error: 'Tipo inválido. Use "entrada" ou "saida".' });
    }

    const deltaAntigo =
      movimentacao.tipo === "entrada"
        ? -movimentacao.quantidade
        : movimentacao.quantidade;
    const deltaNovo = tipo === "entrada" ? quantidade : -quantidade;

    const [[produto]] = await pool.query(
      `SELECT quantidade_estoque FROM produtos WHERE id = ?`,
      [movimentacao.produto_id],
    );

    if (produto.quantidade_estoque + deltaAntigo + deltaNovo < 0) {
      return res.status(400).json({
        error: "Estoque insuficiente para realizar esta operação.",
      });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE movimentacoes SET produto_id = ?, tipo = ?, quantidade = ?, preco_unitario = ? WHERE id = ?`,
        [produto_id, tipo, quantidade, preco_unitario, req.params.id],
      );

      await conn.query(
        `UPDATE produtos SET quantidade_estoque = quantidade_estoque + ? WHERE id = ?`,
        [deltaAntigo + deltaNovo, movimentacao.produto_id],
      );

      await conn.commit();

      const [rows] = await conn.query(
        `SELECT m.*, p.nome AS nome_produto
         FROM movimentacoes m
         JOIN produtos p ON m.produto_id = p.id
         WHERE m.id = ?`,
        [req.params.id],
      );

      res.json(rows[0]);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
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

    const delta =
      existing[0].tipo === "entrada"
        ? -existing[0].quantidade
        : existing[0].quantidade;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(`DELETE FROM movimentacoes WHERE id = ?`, [
        req.params.id,
      ]);

      await conn.query(
        `UPDATE produtos SET quantidade_estoque = quantidade_estoque + ? WHERE id = ?`,
        [delta, existing[0].produto_id],
      );

      await conn.commit();

      res.json({ message: "Movimentação deletada com sucesso." });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    next(error);
  }
};
