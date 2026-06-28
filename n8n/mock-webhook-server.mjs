import http from 'http';

const PORT = 5678;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook/pedido-recomendacao') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const pedido = JSON.parse(body);
      const produtos = pedido.produtos || [];
      const valorTotal = Number(pedido.valorTotal || 0);
      const cliente = pedido.cliente || 'Cliente';

      let perfilCliente = 'Cliente Regular';
      if (valorTotal >= 2000) perfilCliente = 'Cliente Premium';
      else if (produtos.some((p) => /gamer|mouse|teclado|headset/i.test(p))) perfilCliente = 'Gamer';

      const catalogo = [
        'Teclado Mecânico',
        'Headset Gamer',
        'Mousepad XL',
        'Monitor 27"',
        'Webcam HD',
        'Suporte Notebook',
      ];

      const recomendados = catalogo.filter((item) => !produtos.includes(item)).slice(0, 3);
      while (recomendados.length < 3) recomendados.push('Mousepad XL');

      const cupomBase = cliente.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'LOJA';
      const cupomDesconto = `${cupomBase}10`;

      const resposta = {
        perfilCliente,
        recomendacoes: recomendados.join(', '),
        cupomDesconto,
        mensagemIA: `Olá ${cliente}! Obrigado pela sua compra. Use o cupom ${cupomDesconto} e ganhe 10% OFF na próxima compra!`,
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(resposta));
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Mock n8n webhook listening on http://localhost:${PORT}/webhook/pedido-recomendacao`);
});
