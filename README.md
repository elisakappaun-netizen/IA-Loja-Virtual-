# IA-Loja-Virtual-

# IA-Loja-Virtual-
# 🛒 Loja Virtual com IA: Integração Backend, Web e Automação

* **Deploy do Trabalho Final:** [Acessar a Aplicação](https://grupo1trabalho.netlify.app/)

## 🎯 Objetivo
Desenvolver uma aplicação de e-commerce inovadora onde o cadastro de pedidos aciona uma automação inteligente no **n8n**. A automação utiliza Inteligência Artificial para analisar o pedido, gerar recomendações personalizadas e classificar o perfil do cliente de forma dinâmica.

---

## ⚙️ Tecnologias Utilizadas

* **Frontend:** React
* **Backend:** Spring Boot
* **Banco de Dados:** PostgreSQL / H2
* **Automação & IA:** n8n
* **Ambiente de Desenvolvimento:** Cursor

---

## 🔄 Fluxo da Aplicação (Cenário)
Nossa loja virtual automatiza o atendimento e a experiência pós-compra do usuário seguindo uma arquitetura End-to-End:

1. O usuário finaliza a compra na interface em **React**.
2. O React envia as informações do pedido para a nossa API em **Spring Boot**.
3. O Spring Boot salva o pedido com segurança no banco de dados.
4. Imediatamente, o Spring Boot dispara os dados para um Webhook configurado no **n8n**.
5. O n8n entra em ação e aciona o modelo de **Inteligência Artificial** para analisar a compra.
6. A IA processa o JSON e gera:
   * O perfil de consumo do cliente;
   * Lista de produtos recomendados;
   * Uma mensagem de pós-venda totalmente personalizada.
7. O n8n faz um POST/PUT devolvendo essas informações atualizadas para o Spring Boot.
8. O React, de forma reativa, exibe o resultado final da análise instantaneamente na tela do usuário.

---

## 🧑‍💻 Membros da Equipe (Grupo 1)
Desenvolvedores operacionais que construíram esta integração:

| Foto | Usuário | Função |
| :---: | :--- | :--- |
| <img src="https://github.com/elisakappaun-netizen.png" width="60px;"/> | [**Elisa Kappaun**](https://github.com/elisakappaun-netizen) | Fullstack Developer |
| <img src="https://github.com/filipebrollo.png" width="60px;"/> | [**Filipe Brollo**](https://github.com/filipebrollo) | Fullstack Developer |
| <img src="https://github.com/nathaliaa-qa.png" width="60px;"/> | [**Nathália Antunes**](https://github.com/nathaliaa-qa) | Fullstack Developer |
| <img src="https://github.com/llcardos.png" width="60px;"/> | [**Lucas Cardoso**](https://github.com/llcardos) | Fullstack Developer |
