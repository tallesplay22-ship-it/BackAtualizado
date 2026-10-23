const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.post ("/usuarios", userController.criarUsuario);

module.exports = router;