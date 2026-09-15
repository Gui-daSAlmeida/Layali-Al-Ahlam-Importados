const API = 'http://localhost:3000';

async function carregarDashboard() {

    try {

        const resposta = await fetch(`${API}/dashboard`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar dados do Dashboard');
        }

        const dados = await resposta.json();

        console.log('Dados recebidos do Dashboard:', dados);


        // Produtos
        document.getElementById('totalProdutos').textContent =
            dados.total_produtos;


        // Clientes
        document.getElementById('totalClientes').textContent =
            dados.total_clientes;


        // Vendas
        document.getElementById('totalVendas').textContent =
            dados.total_vendas;


        // Faturamento
        document.getElementById('valorTotalVendas').textContent =
            Number(dados.valor_total_vendas).toLocaleString(
                'pt-BR',
                {
                    style: 'currency',
                    currency: 'BRL'
                }
            );


        // Estoque baixo
        document.getElementById('estoqueBaixo').textContent =
            dados.estoque_baixo;

    } catch (erro) {

        console.error(
            'Erro ao carregar Dashboard:',
            erro
        );

    }

}

carregarDashboard();