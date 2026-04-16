const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");

router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);
router.post("/registrar", ctrl.registrar);

module.exports = router;
