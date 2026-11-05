
const mongoose = require("mongoose");
const orderService = require("../services/orderService");
const { orderSchema } = require("../validations/orderValidation");

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Criar pedido
async function criarPedido(req, res, next) {
    try {
        const resultado = orderSchema.safeParse(req.body);

        if (!resultado.success) {
            return res.status(400).json({
                erro: resultado.error.issues[0]?.message || "Dados do pedido inválidos."
            });
        }

        const pedido = await orderService.criarPedido(
            req.user.id,
            resultado.data.itens
        );

        return res.status(201).json(pedido);

    } catch (error) {
        if (
            error.message === "Produto não encontrado." ||
            error.message?.includes("Estoque insuficiente")
        ) {
            return res.status(400).json({
                erro: error.message
            });
        }

        next(error);
    }
}

// Listar pedidos do usuário autenticado
async function listarMeusPedidos(req, res, next) {
    try {
        const pedidos = await orderService.listarPedidosDoUsuario(
            req.user.id
        );

        return res.json(pedidos);

    } catch (error) {
        next(error);
    }
}

// Buscar pedido por ID
async function buscarPedidoPorId(req, res, next) {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const pedido = await orderService.buscarPedidoPorId(
            id,
            req.user.id,
            req.user.tipo
        );

        if (!pedido) {
            return res.status(404).json({
                erro: "Pedido não encontrado."
            });
        }

        return res.json(pedido);

    } catch (error) {
        next(error);
    }
}

// Atualizar status do pedido
async function atualizarStatusPedido(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const statusPermitidos = [
            "pendente",
            "pago",
            "enviado",
            "cancelado"
        ];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                erro: "Status inválido."
            });
        }

        const pedidoAtualizado =
            await orderService.atualizarStatusPedido(id, status);

        if (!pedidoAtualizado) {
            return res.status(404).json({
                erro: "Pedido não encontrado."
            });
        }

        return res.json(pedidoAtualizado);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    criarPedido,
    listarMeusPedidos,
    buscarPedidoPorId,
    atualizarStatusPedido
};
