const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = auth.split(" ")[1];

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = req.usuario.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
