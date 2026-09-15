const API = 'http://localhost:3000';


// ==========================================
// CARREGAR CLIENTES
// ==========================================

async function carregarClientes() {

    try {

        const resposta =
            await fetch(`${API}/clientes`);

        const clientes =
            await resposta.json();


        const lista =
            document.getElementById('listaClientes');


        lista.innerHTML = '';


        clientes.forEach(cliente => {

            const linha =
                document.createElement('tr');


            const data =
                new Date(cliente.data_cadastro)
                    .toLocaleString('pt-BR');


            linha.innerHTML = `

                <td>${cliente.cod_clientes}</td>

                <td>${cliente.nome}</td>

                <td>${cliente.CPF}</td>

                <td>${cliente.telefone}</td>

                <td>${cliente.email}</td>

                <td>${cliente.endereco}</td>

                <td>${data}</td>

            `;


            lista.appendChild(linha);

        });


    } catch (erro) {

        console.error(
            'Erro ao carregar clientes:',
            erro
        );

        alert(
            'Não foi possível carregar os clientes.'
        );

    }

}


// ==========================================
// CADASTRAR CLIENTE
// ==========================================

document
    .getElementById('formCliente')
    .addEventListener(
        'submit',
        async function(event) {

            event.preventDefault();


            const cliente = {

                nome:
                    document.getElementById('nome').value,

                CPF:
                    document.getElementById('CPF').value,

                telefone:
                    document.getElementById('telefone').value,

                email:
                    document.getElementById('email').value,

                endereco:
                    document.getElementById('endereco').value

            };


            try {

                const resposta =
                    await fetch(`${API}/clientes`, {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json'

                        },

                        body:
                            JSON.stringify(cliente)

                    });


                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        resultado.erro ||
                        'Erro ao cadastrar cliente.'
                    );

                    return;

                }


                alert(
                    'Cliente cadastrado com sucesso!'
                );


                document
                    .getElementById('formCliente')
                    .reset();


                carregarClientes();


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