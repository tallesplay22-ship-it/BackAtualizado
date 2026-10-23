const mongoose = require('mongoose')
const productService = require('../services/productService')
const { productSchema } = require("../validations/productValidation");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

async function listarProdutos(req, res, next) {
  try {
    const produtos = await productService.listarProdutos()

    res.json(produtos)
  } catch (error) {
    next(error)
  }
}

async function buscarProdutoPorId(req, res, next) {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        erro: 'ID inválido.',
      })
    }

    const produto = await productService.buscarProdutoPorId(id)

    if (!produto) {
      return res.status(404).json({
        erro: 'Produto não encontrado.',
      })
    }

    res.json(produto)
  } catch (error) {
    next(error)
  }
}

async function criarProduto(req, res, next) {
  try {
    const resultado = productSchema.safeParse(req.body);

if (!resultado.success) {
  return res.status(400).json({
    erro: resultado.error.errors[0].message
  });
}
    
  const novoProduto = await productService.criarProduto(resultado.data);

    res.status(201).json(novoProduto);
  } catch (error) {
    next(error);
  }
}

async function atualizarProduto(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        erro: "ID inválido."
      });
    }

    const resultado = productSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        erro: resultado.error.errors[0].message
      });
    }

    const produtoAtualizado = await productService.atualizarProduto(
      id,
      resultado.data
    );

    if (!produtoAtualizado) {
      return res.status(404).json({
        erro: "Produto não encontrado."
      });
    }

    res.json(produtoAtualizado);
  } catch (error) {
    next(error);
  }
}

async function deletarProduto(req, res, next) {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        erro: 'ID inválido.',
      })
    }

    const produtoDeletado = await productService.deletarProduto(id)

    if (!produtoDeletado) {
      return res.status(404).json({
        erro: 'Produto não encontrado.',
      })
    }

    res.json({
      mensagem: 'Produto deletado com sucesso.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto,
}
