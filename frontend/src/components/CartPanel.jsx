import { formatarMoeda } from '../utils/format';

export default function CartPanel({
  itens,
  cliente,
  cidade,
  loading,
  onClienteChange,
  onCidadeChange,
  onRemove,
  onCheckout,
}) {
  const total = itens.reduce(
    (acc, item) => acc + Number(item.produto.preco) * item.quantidade,
    0,
  );

  return (
    <aside className="cart-panel">
      <h2>Carrinho</h2>

      {itens.length === 0 ? (
        <p className="empty-cart">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="cart-items">
            {itens.map((item) => (
              <li key={item.produto.id}>
                <div>
                  <strong>{item.produto.nome}</strong>
                  <span>
                    {item.quantidade}x {formatarMoeda(item.produto.preco)}
                  </span>
                </div>
                <button type="button" onClick={() => onRemove(item.produto.id)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <span>Total</span>
            <strong>{formatarMoeda(total)}</strong>
          </div>

          <form
            className="checkout-form"
            onSubmit={(event) => {
              event.preventDefault();
              onCheckout();
            }}
          >
            <label>
              Nome do cliente
              <input
                type="text"
                value={cliente}
                onChange={(event) => onClienteChange(event.target.value)}
                placeholder="Maria"
                required
              />
            </label>
            <label>
              Cidade
              <input
                type="text"
                value={cidade}
                onChange={(event) => onCidadeChange(event.target.value)}
                placeholder="Petrópolis"
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Processando pedido...' : 'Finalizar compra'}
            </button>
          </form>
        </>
      )}
    </aside>
  );
}
