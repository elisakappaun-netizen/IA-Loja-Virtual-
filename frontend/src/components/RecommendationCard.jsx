import { formatarMoeda } from '../utils/format';

export default function RecommendationCard({ pedido }) {
  const { recomendacao } = pedido;

  if (!recomendacao) {
    return (
      <section
        className="recommendation-card pending"
        aria-labelledby="recomendacao-pendente-titulo"
        aria-live="polite"
      >
        <h2 id="recomendacao-pendente-titulo">Recomendações em processamento</h2>

        <p>
          Seu pedido foi registrado com sucesso. As recomendações personalizadas
          serão geradas em breve pelo consultor IA.
        </p>

        <p className="loading-message" role="status">
          Aguarde a resposta da IA...
        </p>
      </section>
    );
  }

  const produtosRecomendados = recomendacao.recomendacoes
    ? recomendacao.recomendacoes.split(',').map((produto) => produto.trim())
    : [];

  return (
    <section
      className="recommendation-card"
      aria-labelledby="recomendacao-titulo"
    >
      <h2 id="recomendacao-titulo">Recomendações exclusivas para você</h2>

      <p className="profile-badge">
        Perfil identificado: {recomendacao.perfilCliente}
      </p>

      <p className="recommendation-message">{recomendacao.mensagemIA}</p>

      <div className="coupon-box" aria-label="Cupom de desconto">
        <span>Cupom de desconto</span>
        <strong>{recomendacao.cupomDesconto}</strong>
      </div>

      {produtosRecomendados.length > 0 && (
        <div className="recommended-products">
          <h3>Você também pode gostar de:</h3>

          <ul>
            {produtosRecomendados.map((produto) => (
              <li key={produto}>{produto}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="order-summary">
        <h3>Resumo do pedido #{pedido.id}</h3>

        <p>
          Cliente: {pedido.cliente} — {pedido.cidade}
        </p>

        <p>
          Total pago: <strong>{formatarMoeda(pedido.valorTotal)}</strong>
        </p>

        <ul>
          {pedido.itens.map((item) => (
            <li key={`${item.nomeProduto}-${item.subtotal}`}>
              {item.quantidade}x {item.nomeProduto} — {formatarMoeda(item.subtotal)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}