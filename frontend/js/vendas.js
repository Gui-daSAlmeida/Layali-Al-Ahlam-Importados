const API = 'http://localhost:3000';


// ==========================================
// CARREGAR CLIENTES
// ==========================================

async function carregarClientes() {

    const resposta =
        await fetch(`${API}/clientes`);

    const clientes =
        await resposta.json();


    const select =
        document.getElementById('cliente');


    clientes.forEach(cliente => {

        const option =
            document.createElement('option');

        option.value =
            cliente.cod_clientes;

        option.textContent =
            cliente.nome;

        select.appendChild(option);

    });

}


// ==========================================
// CARREGAR VENDEDORES
// ==========================================

async function carregarVendedores() {

    const resposta =
        await fetch(`${API}/vendedores`);

    const vendedores =
        await resposta.json();


    const select =
        document.getElementById('vendedor');


    vendedores.forEach(vendedor => {

        const option =
            document.createElement('option');

        option.value =
            vendedor.cod_vendedor;

        option.textContent =
            vendedor.nome;

        select.appendChild(option);

    });

}


// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutos() {

    const resposta =
        await fetch(`${API}/produtos`);

    const produtos =
        await resposta.json();


    const select =
        document.getElementById('produto');


    produtos.forEach(produto => {

        const option =
            document.createElement('option');

        option.value =
            produto.cod_produtos;

        option.textContent =
            `${produto.nome} - R$ ${Number(produto.preco).toFixed(2)}`;

        select.appendChild(option);

    });

}


// ==========================================
// CARREGAR VENDAS
// ==========================================

async function carregarVendas() {

    const resposta =
        await fetch(`${API}/vendas`);

    const vendas =
        await resposta.json();


    const lista =
        document.getElementById('listaVendas');


    lista.innerHTML = '';


    vendas.forEach(venda => {

        const linha =
            document.createElement('tr');


        const data =
            new Date(venda.data_venda)
                .toLocaleString('pt-BR');


        linha.innerHTML = `

            <td>${venda.cod_vendas}</td>

            <td>
                ${venda.cliente || 'Cliente não informado'}
            </td>

            <td>
                ${venda.vendedor}
            </td>

            <td>
                ${data}
            </td>

            <td>
                ${Number(venda.valor_venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </td>

        `;


        lista.appendChild(linha);

    });

}


// ==========================================
// REGISTRAR VENDA
// ==========================================

document
    .getElementById('formVenda')
    .addEventListener(
        'submit',
        async function(event) {

            event.preventDefault();


            const cliente =
                document.getElementById('cliente').value;

            const vendedor =
                document.getElementById('vendedor').value;

            const produto =
                document.getElementById('produto').value;

            const quantidade =
                document.getElementById('quantidade').value;


            try {

                const resposta =
                    await fetch(`${API}/vendas`, {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json'

                        },

                        body: JSON.stringify({

                            cod_clientes:
                                cliente,

                            cod_vendedor:
                                vendedor,

                            cod_produtos:
                                produto,

                            quantidade:
                                quantidade

                        })

                    });


                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        resultado.erro ||
                        'Erro ao registrar venda.'
                    );

                    return;

                }


                alert(
                    'Venda registrada com sucesso!'
                );


                document
                    .getElementById('formVenda')
                    .reset();


                carregarVendas();


            } catch (erro) {

                console.error(
                    'Erro:',
                    erro
                );

                alert(
                    'Erro ao conectar com o servidor.'
                );

            }

        }
    );


// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarClientes();

carregarVendedores();

carregarProdutos();

carregarVendas();