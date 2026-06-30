import { useEffect, useState } from 'react';

import AccessibilityToolbar from './components/AccessibilityToolbar';
import ProductCard from './components/ProductCard';
import CartPanel from './components/CartPanel';
import RecommendationCard from './components/RecommendationCard';
import { buscarPedido, criarPedido, listarProdutos } from './services/api';

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

  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    grayscale: false,
    largeText: false,
  });

  const totalItensCarrinho = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0,
  );

  const appClassName = [
    'app',
    accessibility.highContrast ? 'a11y-high-contrast' : '',
    accessibility.grayscale ? 'a11y-grayscale' : '',
    accessibility.largeText ? 'a11y-large-text' : '',
  ]
    .filter(Boolean)
    .join(' ');

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

  useEffect(() => {
    let interval;

    if (pedido && !pedido.recomendacao) {
      interval = setInterval(async () => {
        try {
          const dadosAtualizados = await buscarPedido(pedido.id);

          if (dadosAtualizados.recomendacao !== null) {
            setPedido(dadosAtualizados);
            clearInterval(interval);
          }
        } catch (erro) {
          console.error('Erro ao buscar atualização do pedido:', erro);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pedido]);

  function alternarAcessibilidade(chave) {
    setAccessibility((estadoAtual) => ({
      ...estadoAtual,
      [chave]: !estadoAtual[chave],
    }));
  }

  function limparAcessibilidade() {
    setAccessibility({
      highContrast: false,
      grayscale: false,
      largeText: false,
    });
  }

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
    if (!cliente.trim() || !cidade.trim()) {
      setError('Informe o nome do cliente e a cidade antes de finalizar a compra.');
      return;
    }

    if (carrinho.length === 0) {
      setError('Adicione pelo menos um produto ao carrinho.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        cliente: cliente.trim(),
        cidade: cidade.trim(),
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
    setError('');
  }

  if (pedido) {
    return (
      <div className={appClassName}>
        <a className="skip-link" href="#conteudo-principal">
          Pular para o conteúdo principal
        </a>

        <header className="app-header" role="banner">
          <div>
            <h1>Loja Virtual</h1>
            <p>Pedido registrado com acompanhamento de recomendações por IA.</p>
          </div>

          <button
            type="button"
            className="secondary"
            onClick={reiniciarCompra}
            aria-label="Iniciar uma nova compra"
          >
            Nova compra
          </button>
        </header>

        <AccessibilityToolbar
          settings={accessibility}
          onToggle={alternarAcessibilidade}
          onReset={limparAcessibilidade}
        />

        <main
          id="conteudo-principal"
          className="confirmation-page"
          aria-live="polite"
        >
          <RecommendationCard pedido={pedido} />
        </main>
      </div>
    );
  }

  return (
    <div className={appClassName}>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo principal
      </a>

      <header className="app-header" role="banner">
        <div>
          <h1>Loja Virtual</h1>
          <p>Compre agora e receba recomendações personalizadas com cupom exclusivo.</p>
        </div>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#carrinho">Carrinho ({totalItensCarrinho})</a>
        </nav>
      </header>

      <AccessibilityToolbar
        settings={accessibility}
        onToggle={alternarAcessibilidade}
        onReset={limparAcessibilidade}
      />

      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <main id="conteudo-principal" className="store-layout">
        <section
          id="catalogo"
          className="catalog"
          aria-labelledby="catalogo-titulo"
        >
          <div className="section-heading">
            <h2 id="catalogo-titulo">Catálogo</h2>
            <p>Escolha os produtos e adicione ao carrinho.</p>
          </div>

          {loadingProdutos ? (
            <p className="loading-message" role="status" aria-live="polite">
              Carregando produtos...
            </p>
          ) : (
            <div
              className="product-grid"
              role="list"
              aria-label="Lista de produtos disponíveis"
            >
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