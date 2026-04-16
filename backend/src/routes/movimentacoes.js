const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movimentacoesController");

router.get("/", ctrl.listarMovimentacoes);
router.get("/:id", ctrl.buscarMovimentacao);
router.post("/", ctrl.criarMovimentacao);
router.put("/:id", ctrl.atualizarMovimentacao);
router.delete("/:id", ctrl.deletarMovimentacao);

module.exports = router;
