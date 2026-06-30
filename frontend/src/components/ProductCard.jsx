import { formatarMoeda } from '../utils/format';

const imagensProdutos = {
  Notebook:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  'Mouse Gamer':
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
  'Teclado Mecânico':
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
  'Headset Gamer':
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'Mousepad XL':
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80',
  'Monitor 27"':
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  'Webcam HD':
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=900&q=80',
  'Suporte Notebook':
    'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80',
};

export default function ProductCard({ produto, onAdd }) {
  const tituloId = `produto-${produto.id}-titulo`;
  const descricaoId = `produto-${produto.id}-descricao`;

  const fallbackImage = `https://placehold.co/600x400?text=${encodeURIComponent(
    produto.nome,
  )}`;

  const imagemProduto =
    imagensProdutos[produto.nome] || produto.imagemUrl || fallbackImage;

  function usarImagemReserva(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  }

  return (
    <article
      className="product-card"
      role="listitem"
      aria-labelledby={tituloId}
      aria-describedby={descricaoId}
    >
      <img
        src={imagemProduto}
        alt={`Imagem do produto ${produto.nome}`}
        className="product-image"
        loading="lazy"
        onError={usarImagemReserva}
      />

      <div className="product-info">
        <span className="product-category">{produto.categoria}</span>

        <h3 id={tituloId}>{produto.nome}</h3>

        <p id={descricaoId}>{produto.descricao}</p>

        <div className="product-footer">
          <strong>{formatarMoeda(produto.preco)}</strong>

          <button
            type="button"
            onClick={() => onAdd(produto)}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
          >
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}