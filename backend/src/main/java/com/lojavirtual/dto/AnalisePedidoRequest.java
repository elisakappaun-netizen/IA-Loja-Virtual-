package com.lojavirtual.dto;

public record AnalisePedidoRequest(
        String perfilCliente,
        String recomendacoes,
        String cupomDesconto,
        String mensagemIA
) {
}