package com.lojavirtual.dto;

import java.math.BigDecimal;

public record ProdutoDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        String categoria,
        String imagemUrl
) {
}
