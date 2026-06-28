package com.lojavirtual.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


public record PedidoDTO(
        Long id,
        String cliente,
        String cidade,
        BigDecimal valorTotal,
        LocalDateTime criadoEm,
        List<ItemPedidoDTO> itens,
        RecomendacaoDTO recomendacao
) {
}
