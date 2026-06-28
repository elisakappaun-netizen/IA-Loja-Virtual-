package com.lojavirtual.dto;

import java.math.BigDecimal;
import java.util.List;

public record N8nPedidoPayload(
        Long id,
        String cliente,
        String cidade,
        BigDecimal valorTotal,
        List<String> produtos
) {
}
