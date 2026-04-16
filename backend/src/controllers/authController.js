const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios" });
    }

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (!rows.length) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const usuario = rows[0];
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const payload = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token, usuario: payload });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
exports.me = (req, res, next) => {
  res.json(req.usuario);
};

exports.registrar = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ message: "Nome, email e senha são obrigatórios" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email],
    );

    if (existing.length) {
      return res.status(409).json({ message: "Email já registrado" });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
      [nome, email, senha_hash],
    );

    res.status(201).json({ id: result.insertId, nome, email });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  // Para JWT, o logout é tratado no frontend removendo o token.
  res.json({ message: "Logout realizado com sucesso" });
};
