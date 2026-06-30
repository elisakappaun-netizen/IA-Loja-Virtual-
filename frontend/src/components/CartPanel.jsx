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
    <aside
      id="carrinho"
      className="cart-panel"
      aria-labelledby="carrinho-titulo"
    >
      <h2 id="carrinho-titulo">Carrinho</h2>

      {itens.length === 0 ? (
        <p className="empty-cart">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="cart-items" aria-label="Produtos adicionados ao carrinho">
            {itens.map((item) => (
              <li key={item.produto.id}>
                <div>
                  <strong>{item.produto.nome}</strong>
                  <span>
                    {item.quantidade}x {formatarMoeda(item.produto.preco)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(item.produto.id)}
                  aria-label={`Remover ${item.produto.nome} do carrinho`}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-total" aria-live="polite">
            <span>Total</span>
            <strong>{formatarMoeda(total)}</strong>
          </div>

          <form
            className="checkout-form"
            aria-label="Formulário para finalizar compra"
            onSubmit={(event) => {
              event.preventDefault();
              onCheckout();
            }}
          >
            <div className="form-group">
              <label htmlFor="cliente">Nome do cliente</label>
              <input
                id="cliente"
                name="cliente"
                type="text"
                value={cliente}
                onChange={(event) => onClienteChange(event.target.value)}
                placeholder="Maria"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                name="cidade"
                type="text"
                value={cidade}
                onChange={(event) => onCidadeChange(event.target.value)}
                placeholder="Petrópolis"
                autoComplete="address-level2"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Processando pedido...' : 'Finalizar compra'}
            </button>
          </form>
        </>
      )}
    </aside>
  );
}