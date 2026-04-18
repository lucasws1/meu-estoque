const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/produtosController");

router.get("/", ctrl.listarProdutos);
router.get("/:id", ctrl.buscarProduto);
router.post("/", ctrl.criarProduto);
router.put("/:id", ctrl.atualizarProduto);
router.delete("/:id", ctrl.deletarProduto);

module.exports = router;
