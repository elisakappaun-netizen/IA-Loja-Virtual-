package com.lojavirtual.config;

import com.lojavirtual.model.Produto;
import com.lojavirtual.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedProdutos(ProdutoRepository produtoRepository) {
        return args -> {
            if (produtoRepository.count() > 0) {
                return;
            }

            produtoRepository.save(new Produto(
                    "Notebook",
                    "Notebook 15 polegadas, 16GB RAM, SSD 512GB",
                    new BigDecimal("2500.00"),
                    "Informática",
                    "https://placehold.co/300x200?text=Notebook"
            ));
            produtoRepository.save(new Produto(
                    "Mouse Gamer",
                    "Mouse ergonômico com RGB e 7 botões programáveis",
                    new BigDecimal("120.00"),
                    "Periféricos",
                    "https://placehold.co/300x200?text=Mouse+Gamer"
            ));
            produtoRepository.save(new Produto(
                    "Teclado Mecânico",
                    "Teclado switch blue, retroiluminação RGB",
                    new BigDecimal("350.00"),
                    "Periféricos",
                    "https://placehold.co/300x200?text=Teclado"
            ));
            produtoRepository.save(new Produto(
                    "Headset Gamer",
                    "Headset 7.1 surround com microfone removível",
                    new BigDecimal("280.00"),
                    "Áudio",
                    "https://placehold.co/300x200?text=Headset"
            ));
            produtoRepository.save(new Produto(
                    "Mousepad XL",
                    "Mousepad extra grande antiderrapante",
                    new BigDecimal("89.90"),
                    "Acessórios",
                    "https://placehold.co/300x200?text=Mousepad"
            ));
            produtoRepository.save(new Produto(
                    "Monitor 27\"",
                    "Monitor IPS 144Hz Full HD",
                    new BigDecimal("1499.00"),
                    "Informática",
                    "https://placehold.co/300x200?text=Monitor"
            ));
            produtoRepository.save(new Produto(
                    "Webcam HD",
                    "Webcam 1080p com microfone integrado",
                    new BigDecimal("199.00"),
                    "Periféricos",
                    "https://placehold.co/300x200?text=Webcam"
            ));
            produtoRepository.save(new Produto(
                    "Suporte Notebook",
                    "Suporte ergonômico ajustável em alumínio",
                    new BigDecimal("159.00"),
                    "Acessórios",
                    "https://placehold.co/300x200?text=Suporte"
            ));
        };
    }
}
