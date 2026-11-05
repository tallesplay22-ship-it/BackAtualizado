
const Order = require("../models/Order");
const Product = require("../models/Product");

// Criar pedido
async function criarPedido(usuarioId, itensRecebidos) {

    if (!Array.isArray(itensRecebidos) || itensRecebidos.length === 0) {
        throw new Error("O pedido precisa conter pelo menos um produto.");
    }

    const itensDoPedido = [];
    let total = 0;

    for (const item of itensRecebidos) {

        if (!item.produtoId) {
            throw new Error("ID do produto não informado.");
        }

        if (
            !Number.isInteger(item.quantidade) ||
            item.quantidade <= 0
        ) {
            throw new Error("Quantidade do produto inválida.");
        }

        const produto = await Product.findById(item.produtoId);

        if (!produto) {
            throw new Error("Produto não encontrado.");
        }

        if (produto.estoque < item.quantidade) {
            throw new Error(
                `Estoque insuficiente para o produto: ${produto.nome}`
            );
        }

        const subtotal = produto.preco * item.quantidade;

        itensDoPedido.push({
            produto: produto._id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: item.quantidade,
            subtotal
        });

        total += subtotal;
    }

    const pedido = await Order.create({
        usuario: usuarioId,
        itens: itensDoPedido,
        total,
        status: "pendente"
    });

    return pedido;
}

// Listar pedidos do usuário
async function listarPedidosDoUsuario(usuarioId) {

    const pedidos = await Order.find({
        usuario: usuarioId
    }).sort({
        createdAt: -1
    });

    return pedidos;
}

// Buscar pedido por ID
async function buscarPedidoPorId(pedidoId, usuarioId, tipoUsuario) {

    const filtro = {
        _id: pedidoId
    };

    if (tipoUsuario !== "admin") {
        filtro.usuario = usuarioId;
    }

    const pedido = await Order.findOne(filtro);

    return pedido;
}

// Atualizar status do pedido
async function atualizarStatusPedido(pedidoId, status) {

    const pedidoAtualizado = await Order.findByIdAndUpdate(
        pedidoId,
        { status },
        {
            new: true,
            runValidators: true
        }
    );

    return pedidoAtualizado;
}

module.exports = {
    criarPedido,
    listarPedidosDoUsuario,
    buscarPedidoPorId,
    atualizarStatusPedido
};
