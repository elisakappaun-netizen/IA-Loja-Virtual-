package com.lojavirtual.service;

import com.lojavirtual.dto.CriarPedidoRequest;
import com.lojavirtual.dto.ItemPedidoRequest;
import com.lojavirtual.dto.N8nPedidoPayload;
import com.lojavirtual.dto.PedidoDTO;
import com.lojavirtual.dto.RecomendacaoDTO;
import com.lojavirtual.mapper.DtoMapper;
import com.lojavirtual.model.Pedido;
import com.lojavirtual.model.PedidoItem;
import com.lojavirtual.model.Produto;
import com.lojavirtual.model.Recomendacao;
import com.lojavirtual.repository.PedidoRepository;
import com.lojavirtual.repository.ProdutoRepository;
import com.lojavirtual.repository.RecomendacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final RecomendacaoRepository recomendacaoRepository;
    private final N8nIntegrationService n8nIntegrationService;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ProdutoRepository produtoRepository,
            RecomendacaoRepository recomendacaoRepository,
            N8nIntegrationService n8nIntegrationService
    ) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.recomendacaoRepository = recomendacaoRepository;
        this.n8nIntegrationService = n8nIntegrationService;
    }

    @Transactional
    public PedidoDTO criarPedido(CriarPedidoRequest request) {
        Pedido pedido = new Pedido();
        pedido.setCliente(request.cliente());
        pedido.setCidade(request.cidade());

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemPedidoRequest itemRequest : request.itens()) {
            Produto produto = produtoRepository.findById(itemRequest.produtoId())
                    .orElseThrow(() -> new ResponseStatusException(
                            BAD_REQUEST, "Produto não encontrado: " + itemRequest.produtoId()));

            BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(itemRequest.quantidade()));
            valorTotal = valorTotal.add(subtotal);

            PedidoItem item = new PedidoItem();
            item.setProduto(produto);
            item.setQuantidade(itemRequest.quantidade());
            item.setSubtotal(subtotal);
            pedido.addItem(item);
        }

        if (valorTotal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(BAD_REQUEST, "Valor total do pedido deve ser positivo");
        }

        pedido.setValorTotal(valorTotal);
        Pedido salvo = pedidoRepository.save(pedido);

        List<String> nomesProdutos = salvo.getItens().stream()
                .map(item -> item.getProduto().getNome())
                .toList();

        N8nPedidoPayload payload = new N8nPedidoPayload(
                salvo.getId(),
                salvo.getCliente(),
                salvo.getCidade(),
                salvo.getValorTotal(),
                nomesProdutos
        );

        n8nIntegrationService.solicitarRecomendacao(payload)
                .ifPresent(recomendacaoDTO -> salvarRecomendacao(salvo, recomendacaoDTO));

        return buscarPorId(salvo.getId());
    }

    @Transactional(readOnly = true)
    public PedidoDTO buscarPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Pedido não encontrado"));
        return DtoMapper.toPedidoDTO(pedido);
    }

    @Transactional
    public PedidoDTO salvarRecomendacaoCallback(Long pedidoId, RecomendacaoDTO recomendacaoDTO) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Pedido não encontrado"));

        if (pedido.getRecomendacao() == null) {
            salvarRecomendacao(pedido, recomendacaoDTO);
        }

        return DtoMapper.toPedidoDTO(pedido);
    }

    private void salvarRecomendacao(Pedido pedido, RecomendacaoDTO dto) {
        Recomendacao recomendacao = new Recomendacao();
        recomendacao.setPedido(pedido);
        recomendacao.setPerfilCliente(dto.perfilCliente());
        recomendacao.setRecomendacoes(dto.recomendacoes());
        recomendacao.setCupomDesconto(dto.cupomDesconto());
        recomendacao.setMensagemIA(dto.mensagemIA());
        recomendacaoRepository.save(recomendacao);
        pedido.setRecomendacao(recomendacao);
    }
}
