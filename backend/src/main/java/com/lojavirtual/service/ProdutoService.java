package com.lojavirtual.service;

import com.lojavirtual.dto.ProdutoDTO;
import com.lojavirtual.mapper.DtoMapper;
import com.lojavirtual.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<ProdutoDTO> listarTodos() {
        return produtoRepository.findAll().stream()
                .map(DtoMapper::toProdutoDTO)
                .toList();
    }
}
