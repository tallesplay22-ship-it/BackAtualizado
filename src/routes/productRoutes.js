const express = require("express");

const productController = require("../controllers/productController");

const verificarAdmin = require("../middlewares/adminMiddleware");

const router = express.Router(); 

router.get("/produtos", productController.listarProdutos);

router.get("/produtos/:id", productController.buscarProdutoPorId);

router.post("/produtos", verificarAdmin, productController.criarProduto);

router.put("/produtos/:id", productController.atualizarProduto);

router.delete("/produtos/:id", verificarAdmin, productController.deletarProduto);                                                  //verificarAdmin

module.exports = router;