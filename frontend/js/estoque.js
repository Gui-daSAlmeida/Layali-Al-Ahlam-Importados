const API = 'http://localhost:3000';


// ==========================================
// CARREGAR PRODUTOS NO SELECT
// ==========================================

async function carregarProdutos() {

    try {

        const resposta = await fetch(`${API}/produtos`);

        const produtos = await resposta.json();

        const select = document.getElementById('produto');

        produtos.forEach(produto => {

            const option = document.createElement('option');

            option.value = produto.cod_produtos;

            option.textContent =
                `${produto.nome} - ${produto.marca}`;

            select.appendChild(option);

        });

    } catch (erro) {

        console.error('Erro ao carregar produtos:', erro);

    }

}


// ==========================================
// CARREGAR ESTOQUE
// ==========================================

async function carregarEstoque() {

    try {

        const resposta = await fetch(`${API}/estoque`);

        const estoque = await resposta.json();

        const lista = document.getElementById('listaEstoque');

        lista.innerHTML = '';


        estoque.forEach(item => {

            let status;


            if (item.quantidade === 0) {

                status = '❌ Sem estoque';

            } else if (item.quantidade <= item.estoque_minimo) {

                status = '⚠️ Estoque baixo';

            } else {

                status = '✅ Normal';

            }


            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>${item.cod_produtos}</td>

                <td>${item.nome}</td>

                <td>${item.marca}</td>

                <td>${item.quantidade}</td>

                <td>${item.estoque_minimo}</td>

                <td>${status}</td>
            `;


            lista.appendChild(linha);

        });


    } catch (erro) {

        console.error('Erro ao carregar estoque:', erro);

        alert('Não foi possível carregar o estoque.');

    }

}


// ==========================================
// SALVAR ESTOQUE
// ==========================================

document
    .getElementById('formEstoque')
    .addEventListener('submit', async function(event) {

        event.preventDefault();


        const cod_produtos =
            document.getElementById('produto').value;

        const quantidade =
            document.getElementById('quantidade').value;

        const estoque_minimo =
            document.getElementById('estoque_minimo').value;


        try {

            const resposta = await fetch(`${API}/estoque`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    cod_produtos,
                    quantidade,
                    estoque_minimo

                })

            });


            const resultado = await resposta.json();


            if (!resposta.ok) {

                alert(
                    resultado.erro ||
                    'Erro ao salvar estoque.'
                );

                return;

            }


            alert('Estoque salvo com sucesso!');


            document
                .getElementById('formEstoque')
                .reset();


            carregarEstoque();


        } catch (erro) {

            console.error('Erro:', erro);

            alert(
                'Erro ao conectar com o servidor.'
            );

        }

    });


// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarProdutos();

carregarEstoque();