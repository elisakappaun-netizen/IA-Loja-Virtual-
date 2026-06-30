import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function listarProdutos() {
  const { data } = await api.get('/produtos');
  return data;
}

export async function criarPedido(pedido) {
  const { data } = await api.post('/pedidos', pedido);
  return data;
}

export async function buscarPedido(id) {
  const { data } = await api.get(`/pedidos/${id}`);
  return data;
}