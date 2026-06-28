package com.lojavirtual.repository;

import com.lojavirtual.model.Recomendacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecomendacaoRepository extends JpaRepository<Recomendacao, Long> {

    Optional<Recomendacao> findByPedidoId(Long pedidoId);
}
