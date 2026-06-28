package com.lojavirtual.service;

import com.lojavirtual.dto.N8nPedidoPayload;
import com.lojavirtual.dto.RecomendacaoDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Optional;

@Service
public class N8nIntegrationService {

    private static final Logger log = LoggerFactory.getLogger(N8nIntegrationService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String webhookUrl;

    public N8nIntegrationService(
            RestTemplateBuilder restTemplateBuilder,
            ObjectMapper objectMapper,
            @Value("${n8n.webhook.url}") String webhookUrl,
            @Value("${n8n.webhook.timeout-ms:30000}") long timeoutMs
    ) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(timeoutMs))
                .setReadTimeout(Duration.ofMillis(timeoutMs))
                .build();
        this.objectMapper = objectMapper;
        this.webhookUrl = webhookUrl;
    }

    public Optional<RecomendacaoDTO> solicitarRecomendacao(N8nPedidoPayload payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<N8nPedidoPayload> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(webhookUrl, request, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.warn("n8n retornou status {} para pedido {}", response.getStatusCode(), payload.id());
                return Optional.empty();
            }

            RecomendacaoDTO recomendacao = parseRecomendacao(response.getBody());
            if (isValid(recomendacao)) {
                return Optional.of(recomendacao);
            }

            log.warn("Resposta n8n inválida para pedido {}: {}", payload.id(), response.getBody());
            return Optional.empty();
        } catch (RestClientException ex) {
            log.warn("Falha ao chamar n8n para pedido {}: {}", payload.id(), ex.getMessage());
            return Optional.empty();
        } catch (Exception ex) {
            log.warn("Erro ao processar resposta n8n para pedido {}: {}", payload.id(), ex.getMessage());
            return Optional.empty();
        }
    }

    private RecomendacaoDTO parseRecomendacao(String body) throws Exception {
        String cleaned = body.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```(?:json)?\\s*", "").replaceAll("\\s*```$", "");
        }
        return objectMapper.readValue(cleaned, RecomendacaoDTO.class);
    }

    private boolean isValid(RecomendacaoDTO recomendacao) {
        return recomendacao != null
                && recomendacao.perfilCliente() != null && !recomendacao.perfilCliente().isBlank()
                && recomendacao.recomendacoes() != null && !recomendacao.recomendacoes().isBlank()
                && recomendacao.cupomDesconto() != null && !recomendacao.cupomDesconto().isBlank()
                && recomendacao.mensagemIA() != null && !recomendacao.mensagemIA().isBlank();
    }
}
