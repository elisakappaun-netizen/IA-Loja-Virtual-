import { formatarMoeda } from '../utils/format';

export default function ProductCard({ produto, onAdd }) {
  return (
    <article className="product-card">
      <img src={produto.imagemUrl} alt={produto.nome} className="product-image" />
      <div className="product-info">
        <span className="product-category">{produto.categoria}</span>
        <h3>{produto.nome}</h3>
        <p>{produto.descricao}</p>
        <div className="product-footer">
          <strong>{formatarMoeda(produto.preco)}</strong>
          <button type="button" onClick={() => onAdd(produto)}>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
