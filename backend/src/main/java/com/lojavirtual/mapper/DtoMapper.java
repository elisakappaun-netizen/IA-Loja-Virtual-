package com.lojavirtual.mapper;

import com.lojavirtual.dto.ItemPedidoDTO;
import com.lojavirtual.dto.PedidoDTO;
import com.lojavirtual.dto.ProdutoDTO;
import com.lojavirtual.dto.RecomendacaoDTO;
import com.lojavirtual.model.Pedido;
import com.lojavirtual.model.PedidoItem;
import com.lojavirtual.model.Produto;
import com.lojavirtual.model.Recomendacao;

import java.util.List;

public final class DtoMapper {

    private DtoMapper() {
    }

    public static ProdutoDTO toProdutoDTO(Produto produto) {
        return new ProdutoDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getCategoria(),
                produto.getImagemUrl()
        );
    }

    public static PedidoDTO toPedidoDTO(Pedido pedido) {
        List<ItemPedidoDTO> itens = pedido.getItens().stream()
                .map(DtoMapper::toItemPedidoDTO)
                .toList();

        RecomendacaoDTO recomendacao = pedido.getRecomendacao() != null
                ? toRecomendacaoDTO(pedido.getRecomendacao())
                : null;

        return new PedidoDTO(
                pedido.getId(),
                pedido.getCliente(),
                pedido.getCidade(),
                pedido.getValorTotal(),
                pedido.getCriadoEm(),
                itens,
                recomendacao
        );
    }

    public static ItemPedidoDTO toItemPedidoDTO(PedidoItem item) {
        return new ItemPedidoDTO(
                item.getProduto().getId(),
                item.getProduto().getNome(),
                item.getQuantidade(),
                item.getSubtotal()
        );
    }

    public static RecomendacaoDTO toRecomendacaoDTO(Recomendacao recomendacao) {
        return new RecomendacaoDTO(
                recomendacao.getPerfilCliente(),
                recomendacao.getRecomendacoes(),
                recomendacao.getCupomDesconto(),
                recomendacao.getMensagemIA()
        );
    }
}
