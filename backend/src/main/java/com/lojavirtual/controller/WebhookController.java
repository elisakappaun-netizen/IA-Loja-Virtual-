package com.lojavirtual.controller;

import com.lojavirtual.dto.RecomendacaoDTO;
import com.lojavirtual.dto.PedidoDTO;
import com.lojavirtual.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final PedidoService pedidoService;

    public WebhookController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/recomendacao/{pedidoId}")
    public PedidoDTO receberRecomendacao(
            @PathVariable Long pedidoId,
            @Valid @RequestBody RecomendacaoDTO recomendacao
    ) {
        return pedidoService.salvarRecomendacaoCallback(pedidoId, recomendacao);
    }
}
