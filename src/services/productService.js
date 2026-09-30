const Product = require("../models/Product");

async function listarProdutos() {
  const produtos = await Product.find();

  return produtos;
}

async function buscarProdutoPorId(id) {
  const produto = await Product.findById(id);

  return produto;
}

async function criarProduto(dados) {
  const novoProduto = await Product.create(dados);

  return novoProduto;
}

async function atualizarProduto(id, dados) {
  const produtoAtualizado = await Product.findByIdAndUpdate(id, dados, {
    new: true
  });

  return produtoAtualizado;
}

async function deletarProduto(id) {
  const produtoDeletado = await Product.findByIdAndDelete(id);

  return produtoDeletado;
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
};