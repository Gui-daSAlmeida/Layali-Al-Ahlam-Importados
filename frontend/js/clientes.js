const API = 'http://localhost:3000';


// ==========================================
// FORMATAÇÃO CPF E TELEFONE
// ==========================================

function formatarCPF(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return numeros.replace(/(\d{3})(\d+)/, '$1.$2');
    if (numeros.length <= 9) return numeros.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');

    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
}

function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) return numeros ? `(${numeros}` : '';
    if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;

    if (numeros.length <= 10) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function formatarCPFNaTabela(valor) {
    const numeros = String(valor ?? '').replace(/\D/g, '');
    return numeros.length === 11 ? formatarCPF(numeros) : (valor ?? '');
}

function formatarTelefoneNaTabela(valor) {
    const numeros = String(valor ?? '').replace(/\D/g, '');
    return (numeros.length === 10 || numeros.length === 11)
        ? formatarTelefone(numeros)
        : (valor ?? '');
}


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

                <td>${formatarCPFNaTabela(cliente.CPF)}</td>

                <td>${formatarTelefoneNaTabela(cliente.telefone)}</td>

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
// MÁSCARAS DOS CAMPOS
// ==========================================

document.getElementById('CPF').addEventListener('input', function () {
    this.value = formatarCPF(this.value);
});

document.getElementById('telefone').addEventListener('input', function () {
    this.value = formatarTelefone(this.value);
});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarClientes();