import { formatarMoeda } from '../utils/format';

export default function RecommendationCard({ pedido }) {
  const { recomendacao } = pedido;

  if (!recomendacao) {
    return (
      <section className="recommendation-card pending">
        <h2>Recomendações em processamento</h2>
        <p>
          Seu pedido foi registrado com sucesso. As recomendações personalizadas
          serão geradas em breve pelo consultor IA.
        </p>
      </section>
    );
  }

  return (
    <section className="recommendation-card">
      <h2>Recomendações exclusivas para você</h2>
      <p className="profile-badge">{recomendacao.perfilCliente}</p>
      <p className="recommendation-message">{recomendacao.mensagemIA}</p>

      <div className="coupon-box">
        <span>Cupom de desconto</span>
        <strong>{recomendacao.cupomDesconto}</strong>
      </div>

      <div className="recommended-products">
        <h3>Você também pode gostar de:</h3>
        <ul>
          {recomendacao.recomendacoes.split(',').map((produto) => (
            <li key={produto.trim()}>{produto.trim()}</li>
          ))}
        </ul>
      </div>

      <div className="order-summary">
        <h3>Resumo do pedido #{pedido.id}</h3>
        <p>
          Cliente: {pedido.cliente} — {pedido.cidade}
        </p>
        <p>Total pago: {formatarMoeda(pedido.valorTotal)}</p>
        <ul>
          {pedido.itens.map((item) => (
            <li key={`${item.produtoId}-${item.nomeProduto}`}>
              {item.quantidade}x {item.nomeProduto} — {formatarMoeda(item.subtotal)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
