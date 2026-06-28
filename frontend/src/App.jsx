import { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import CartPanel from './components/CartPanel';
import RecommendationCard from './components/RecommendationCard';
import { criarPedido, listarProdutos } from './services/api';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [cliente, setCliente] = useState('');
  const [cidade, setCidade] = useState('');
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const data = await listarProdutos();
        setProdutos(data);
      } catch {
        setError('Não foi possível carregar os produtos. Verifique se o backend está ativo.');
      } finally {
        setLoadingProdutos(false);
      }
    }

    carregarProdutos();
  }, []);

  function adicionarAoCarrinho(produto) {
    setCarrinho((prev) => {
      const existente = prev.find((item) => item.produto.id === produto.id);
      if (existente) {
        return prev.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
  }

  function removerDoCarrinho(produtoId) {
    setCarrinho((prev) => prev.filter((item) => item.produto.id !== produtoId));
  }

  async function finalizarCompra() {
    setLoading(true);
    setError('');

    try {
      const payload = {
        cliente,
        cidade,
        itens: carrinho.map((item) => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
        })),
      };

      const pedidoCriado = await criarPedido(payload);
      setPedido(pedidoCriado);
      setCarrinho([]);
    } catch {
      setError('Erro ao finalizar a compra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function reiniciarCompra() {
    setPedido(null);
    setCliente('');
    setCidade('');
  }

  if (pedido) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Loja Virtual</h1>
          <button type="button" className="secondary" onClick={reiniciarCompra}>
            Nova compra
          </button>
        </header>
        <main className="confirmation-page">
          <RecommendationCard pedido={pedido} />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Loja Virtual</h1>
          <p>Compre agora e receba recomendações personalizadas com cupom exclusivo.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="store-layout">
        <section className="catalog">
          <h2>Catálogo</h2>
          {loadingProdutos ? (
            <p>Carregando produtos...</p>
          ) : (
            <div className="product-grid">
              {produtos.map((produto) => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                  onAdd={adicionarAoCarrinho}
                />
              ))}
            </div>
          )}
        </section>

        <CartPanel
          itens={carrinho}
          cliente={cliente}
          cidade={cidade}
          loading={loading}
          onClienteChange={setCliente}
          onCidadeChange={setCidade}
          onRemove={removerDoCarrinho}
          onCheckout={finalizarCompra}
        />
      </main>
    </div>
  );
}

export default App;
