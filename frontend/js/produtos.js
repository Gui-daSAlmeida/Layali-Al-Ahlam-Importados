const API = 'http://localhost:3000';


// Buscar produtos
async function carregarProdutos() {

    try {

        const resposta = await fetch(`${API}/produtos`);

        const produtos = await resposta.json();

        const lista = document.getElementById('listaProdutos');

        lista.innerHTML = '';

        produtos.forEach(produto => {

            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>${produto.cod_produtos}</td>
                <td>${produto.marca}</td>
                <td>${produto.nome}</td>
                <td>${produto.categoria || ''}</td>
                <td class="price">${Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${produto.codigo || ''}</td>
            `;

            lista.appendChild(linha);

        });

    } catch (erro) {

        console.error('Erro:', erro);

        alert('Não foi possível carregar os produtos.');

    }
}


// Cadastrar produto
document.getElementById('formProduto').addEventListener('submit', async function(event) {

    event.preventDefault();

    const produto = {

        marca: document.getElementById('marca').value,

        nome: document.getElementById('nome').value,

        categoria: document.getElementById('categoria').value,

        preco: document.getElementById('preco').value,

        codigo: document.getElementById('codigo').value

    };


    try {

        const resposta = await fetch(`${API}/produtos`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(produto)

        });


        const resultado = await resposta.json();


        if (!resposta.ok) {

            alert(resultado.erro || 'Erro ao cadastrar produto.');

            return;

        }


        alert('Produto cadastrado com sucesso!');

        document.getElementById('formProduto').reset();

        carregarProdutos();


    } catch (erro) {

        console.error('Erro:', erro);

        alert('Erro ao conectar com o servidor.');

    }

});


// Carregar produtos ao abrir a página
carregarProdutos();