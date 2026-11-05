
const { z } = require("zod");

const orderSchema = z.object({
    itens: z.array(
        z.object({
            produtoId: z.string()
                .regex(/^[0-9a-fA-F]{24}$/, "ID do produto inválido."),

            quantidade: z.number()
                .int("A quantidade deve ser um número inteiro.")
                .positive("A quantidade deve ser maior que zero.")
        })
    ).min(1, "O pedido precisa conter pelo menos um produto.")
});

module.exports = {
    orderSchema
};
