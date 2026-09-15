const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const db = require('./database');


// ==========================================
// CONFIGURAÇÕES
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// FRONTEND
// ==========================================

app.use(
    express.static(
        path.join(__dirname, '../frontend')
    )
);


// Página inicial
app.get('/', (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            '../frontend/index.html'
        )
    );

});

// ==========================================
// DASHBOARD
// ==========================================

app.get('/dashboard', (req, res) => {

    const sql = `
        SELECT

            (SELECT COUNT(*)
             FROM produtos) AS total_produtos,

            (SELECT COUNT(*)
             FROM clientes) AS total_clientes,

            (SELECT COUNT(*)
             FROM vendas) AS total_vendas,

            (SELECT COALESCE(SUM(valor_venda), 0)
             FROM vendas) AS valor_total_vendas,

            (SELECT COUNT(*)
             FROM estoque
             WHERE quantidade <= estoque_minimo) AS estoque_baixo

    `;

    db.query(sql, (erro, resultados) => {

        if (erro) {

            console.error(
                'Erro ao carregar dashboard:',
                erro
            );

            return res.status(500).json({
                erro:
                    'Erro ao carregar dados do dashboard.'
            });

        }

        res.json(resultados[0]);

    });

});

// ==========================================
// PRODUTOS
// ==========================================


// Listar produtos
app.get('/produtos', (req, res) => {

    const sql = `
        SELECT *
        FROM produtos
        ORDER BY nome
    `;


    db.query(sql, (erro, resultados) => {

        if (erro) {

            console.error(
                'Erro ao buscar produtos:',
                erro
            );

            return res.status(500).json({
                erro: 'Erro ao buscar produtos'
            });

        }


        res.json(resultados);

    });

});


// Cadastrar produto
app.post('/produtos', (req, res) => {

    const {
        marca,
        nome,
        categoria,
        preco,
        codigo
    } = req.body;


    if (!marca || !nome || !preco) {

        return res.status(400).json({

            erro:
                'Marca, nome e preço são obrigatórios.'

        });

    }


    const sql = `
        INSERT INTO produtos
        (
            marca,
            nome,
            categoria,
            preco,
            codigo
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            marca,
            nome,
            categoria || null,
            preco,
            codigo || null
        ],
        (erro, resultado) => {

            if (erro) {

                console.error(
                    'Erro ao cadastrar produto:',
                    erro
                );


                if (erro.code === 'ER_DUP_ENTRY') {

                    return res.status(400).json({

                        erro:
                            'O código do produto já está cadastrado.'

                    });

                }


                return res.status(500).json({

                    erro:
                        'Erro ao cadastrar produto.'

                });

            }


            res.status(201).json({

                mensagem:
                    'Produto cadastrado com sucesso!',

                id:
                    resultado.insertId

            });

        }
    );

});


// ==========================================
// ESTOQUE
// ==========================================


// Listar estoque
app.get('/estoque', (req, res) => {

    const sql = `
        SELECT
            estoque.cod_produtos,
            produtos.nome,
            produtos.marca,
            estoque.quantidade,
            estoque.estoque_minimo

        FROM estoque

        INNER JOIN produtos
            ON estoque.cod_produtos =
               produtos.cod_produtos

        ORDER BY produtos.nome
    `;


    db.query(sql, (erro, resultados) => {

        if (erro) {

            console.error(
                'Erro ao buscar estoque:',
                erro
            );


            return res.status(500).json({

                erro:
                    'Erro ao buscar estoque'

            });

        }


        res.json(resultados);

    });

});


// Cadastrar ou atualizar estoque
app.post('/estoque', (req, res) => {

    const {
        cod_produtos,
        quantidade,
        estoque_minimo
    } = req.body;


    if (
        !cod_produtos ||
        quantidade === undefined ||
        estoque_minimo === undefined
    ) {

        return res.status(400).json({

            erro:
                'Produto, quantidade e estoque mínimo são obrigatórios.'

        });

    }


    if (
        Number(quantidade) < 0 ||
        Number(estoque_minimo) < 0
    ) {

        return res.status(400).json({

            erro:
                'Quantidade e estoque mínimo não podem ser negativos.'

        });

    }


    const sql = `
        INSERT INTO estoque
        (
            cod_produtos,
            quantidade,
            estoque_minimo
        )
        VALUES (?, ?, ?)

        ON DUPLICATE KEY UPDATE

            quantidade =
                VALUES(quantidade),

            estoque_minimo =
                VALUES(estoque_minimo)
    `;


    db.query(
        sql,
        [
            cod_produtos,
            quantidade,
            estoque_minimo
        ],
        (erro, resultado) => {

            if (erro) {

                console.error(
                    'Erro ao salvar estoque:',
                    erro
                );


                return res.status(500).json({

                    erro:
                        'Erro ao salvar estoque.'

                });

            }


            res.status(201).json({

                mensagem:
                    'Estoque salvo com sucesso!'

            });

        }
    );

});


// ==========================================
// CLIENTES
// ==========================================


// Listar clientes
app.get('/clientes', (req, res) => {

    const sql = `
        SELECT *
        FROM clientes
        ORDER BY nome
    `;


    db.query(sql, (erro, resultados) => {

        if (erro) {

            console.error(
                'Erro ao buscar clientes:',
                erro
            );


            return res.status(500).json({

                erro:
                    'Erro ao buscar clientes'

            });

        }


        res.json(resultados);

    });

});


// Cadastrar cliente
app.post('/clientes', (req, res) => {

    const {
        nome,
        CPF,
        telefone,
        email,
        endereco
    } = req.body;


    if (
        !nome ||
        !CPF ||
        !telefone ||
        !email ||
        !endereco
    ) {

        return res.status(400).json({

            erro:
                'Todos os campos são obrigatórios.'

        });

    }


    const sql = `
        INSERT INTO clientes
        (
            nome,
            CPF,
            telefone,
            email,
            endereco
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            nome,
            CPF,
            telefone,
            email,
            endereco
        ],
        (erro, resultado) => {

            if (erro) {

                console.error(
                    'Erro ao cadastrar cliente:',
                    erro
                );


                if (
                    erro.code === 'ER_DUP_ENTRY'
                ) {

                    return res.status(400).json({

                        erro:
                            'Este CPF já está cadastrado.'

                    });

                }


                return res.status(500).json({

                    erro:
                        'Erro ao cadastrar cliente.'

                });

            }


            res.status(201).json({

                mensagem:
                    'Cliente cadastrado com sucesso!',

                id:
                    resultado.insertId

            });

        }
    );

});


// ==========================================
// VENDEDORES
// ==========================================


// Listar vendedores
app.get('/vendedores', (req, res) => {

    const sql = `
        SELECT *
        FROM vendedores
        ORDER BY nome
    `;


    db.query(sql, (erro, resultados) => {

        if (erro) {

            console.error(
                'Erro ao buscar vendedores:',
                erro
            );


            return res.status(500).json({

                erro:
                    'Erro ao buscar vendedores'

            });

        }


        res.json(resultados);

    });

});


// ==========================================
// VENDAS
// ==========================================


// Listar vendas
app.get('/vendas', (req, res) => {

    const sql = `

        SELECT

            vendas.cod_vendas,

            clientes.nome AS cliente,

            vendedores.nome AS vendedor,

            vendas.data_venda,

            vendas.valor_venda

        FROM vendas

        LEFT JOIN clientes
            ON vendas.cod_clientes =
               clientes.cod_clientes

        INNER JOIN vendedores
            ON vendas.cod_vendedor =
               vendedores.cod_vendedor

        ORDER BY vendas.cod_vendas DESC

    `;


    db.query(sql, (erro, resultados) => {

        if (erro) {

            console.error(
                'Erro ao buscar vendas:',
                erro
            );


            return res.status(500).json({

                erro:
                    'Erro ao buscar vendas'

            });

        }


        res.json(resultados);

    });

});


// ==========================================
// REGISTRAR VENDA
// ==========================================

app.post('/vendas', (req, res) => {

    const {
        cod_clientes,
        cod_vendedor,
        cod_produtos,
        quantidade
    } = req.body;


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (
        !cod_clientes ||
        !cod_vendedor ||
        !cod_produtos ||
        !quantidade
    ) {

        return res.status(400).json({
            erro:
                'Cliente, vendedor, produto e quantidade são obrigatórios.'
        });

    }


    if (Number(quantidade) <= 0) {

        return res.status(400).json({
            erro:
                'A quantidade deve ser maior que zero.'
        });

    }


    // ==========================================
    // INICIAR TRANSAÇÃO
    // ==========================================

    db.beginTransaction((erro) => {

        if (erro) {

            console.error(
                'Erro ao iniciar transação:',
                erro
            );

            return res.status(500).json({
                erro:
                    'Erro ao iniciar a venda.'
            });

        }


        // ==========================================
        // BUSCAR PREÇO DO PRODUTO
        // ==========================================

        const sqlProduto = `
            SELECT preco
            FROM produtos
            WHERE cod_produtos = ?
        `;


        db.query(
            sqlProduto,
            [cod_produtos],
            (erro, produtos) => {

                if (erro) {

                    return db.rollback(() => {

                        console.error(erro);

                        res.status(500).json({
                            erro:
                                'Erro ao buscar produto.'
                        });

                    });

                }


                // Produto não encontrado

                if (produtos.length === 0) {

                    return db.rollback(() => {

                        res.status(404).json({
                            erro:
                                'Produto não encontrado.'
                        });

                    });

                }


                // ==========================================
                // CALCULAR VALOR
                // ==========================================

                const preco =
                    Number(produtos[0].preco);

                const total =
                    preco * Number(quantidade);


                // ==========================================
                // CRIAR VENDA
                // ==========================================

                const sqlVenda = `
                    INSERT INTO vendas
                    (
                        cod_clientes,
                        cod_vendedor,
                        valor_venda
                    )
                    VALUES (?, ?, ?)
                `;


                db.query(
                    sqlVenda,
                    [
                        cod_clientes,
                        cod_vendedor,
                        total
                    ],
                    (erro, resultadoVenda) => {

                        if (erro) {

                            return db.rollback(() => {

                                console.error(erro);

                                res.status(500).json({
                                    erro:
                                        'Erro ao criar venda.'
                                });

                            });

                        }


                        const cod_vendas =
                            resultadoVenda.insertId;


                        // ==========================================
                        // INSERIR ITEM DA VENDA
                        // ==========================================

                        const sqlItem = `
                            INSERT INTO itens_venda
                            (
                                cod_vendas,
                                cod_produtos,
                                quantidade,
                                preco_unitario,
                                subtotal
                            )
                            VALUES (?, ?, ?, ?, ?)
                        `;


                        db.query(
                            sqlItem,
                            [
                                cod_vendas,
                                cod_produtos,
                                quantidade,
                                preco,
                                total
                            ],
                            (erro) => {

                                // ==========================================
                                // ERRO → DESFAZER TUDO
                                // ==========================================

                                if (erro) {

                                    return db.rollback(() => {

                                        console.error(
                                            'Venda cancelada:',
                                            erro
                                        );

                                        res.status(400).json({
                                            erro:
                                                erro.sqlMessage ||
                                                'Não foi possível registrar a venda.'
                                        });

                                    });

                                }


                                // ==========================================
                                // SUCESSO → CONFIRMAR TUDO
                                // ==========================================

                                db.commit((erro) => {

                                    if (erro) {

                                        return db.rollback(() => {

                                            console.error(
                                                'Erro ao confirmar venda:',
                                                erro
                                            );

                                            res.status(500).json({
                                                erro:
                                                    'Erro ao finalizar a venda.'
                                            });

                                        });

                                    }


                                    // ==========================================
                                    // RESPOSTA FINAL
                                    // ==========================================

                                    res.status(201).json({

                                        mensagem:
                                            'Venda registrada com sucesso!',

                                        cod_vendas:
                                            cod_vendas,

                                        valor:
                                            total

                                    });

                                });

                            }
                        );

                    }
                );

            }
        );

    });

});

// ==========================================
// SERVIDOR
// ==========================================

const PORTA = 3000;


app.listen(PORTA, () => {

    console.log(
        `🚀 Servidor rodando em http://localhost:${PORTA}`
    );

});