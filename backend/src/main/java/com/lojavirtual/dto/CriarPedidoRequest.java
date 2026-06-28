package com.lojavirtual.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CriarPedidoRequest(
        @NotBlank String cliente,
        @NotBlank String cidade,
        @NotEmpty @Valid List<ItemPedidoRequest> itens
) {
}
