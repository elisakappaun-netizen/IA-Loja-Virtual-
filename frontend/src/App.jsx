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

  // 1. Carrega os produtos iniciais
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

  // 2. O DESPERTADOR DA IA (Polling)
  // Fica perguntando ao Spring Boot a cada 5 segundos se a IA já respondeu
  useEffect(() => {
    let interval;
    
    // Se temos um pedido, mas a recomendação ainda é null, ligamos o timer
    if (pedido && !pedido.recomendacao) {
      interval = setInterval(async () => {
        try {
          const resposta = await fetch(`http://localhost:8080/api/pedidos/${pedido.id}`);
          const dadosAtualizados = await resposta.json();

          // Se a recomendação finalmente chegou do n8n/Gemini...
          if (dadosAtualizados.recomendacao !== null) {
            setPedido(dadosAtualizados); // Atualiza a tela!
            clearInterval(interval); // Desliga o timer
          }
        } catch (erro) {
          console.error("Erro ao buscar atualização do pedido:", erro);
        }
      }, 5000); // 5000 = 5 segundos
    }

    // Limpa o timer se o usuário sair da página ou fechar a compra
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pedido]);

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