-- =========================================================
-- BANCO DE DADOS: LAYALI AL AHLAM IMPORTADOS
-- Loja: Layali Al Ahlam Importados
-- Descrição: Estrutura, relacionamentos, trigger e dados de teste
-- =========================================================

-- ---------------------------------------------------------
-- 1. CRIAÇÃO DO BANCO
-- ---------------------------------------------------------

CREATE DATABASE IF NOT EXISTS perfume;

USE perfume;


-- ---------------------------------------------------------
-- 2. TABELA: CLIENTES
-- ---------------------------------------------------------

CREATE TABLE clientes(
    cod_clientes INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cod_clientes)
);


-- ---------------------------------------------------------
-- 3. TABELA: VENDEDORES
-- ---------------------------------------------------------

CREATE TABLE vendedores(
    cod_vendedor INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    PRIMARY KEY (cod_vendedor)
);


-- ---------------------------------------------------------
-- 4. TABELA: PRODUTOS
-- ---------------------------------------------------------

CREATE TABLE produtos(
    cod_produtos INT NOT NULL AUTO_INCREMENT,
    marca VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    codigo VARCHAR(50) UNIQUE,
    PRIMARY KEY (cod_produtos)
);


-- ---------------------------------------------------------
-- 5. TABELA: ESTOQUE
-- ---------------------------------------------------------

CREATE TABLE estoque(
    cod_estoque INT NOT NULL AUTO_INCREMENT,
    cod_produtos INT NOT NULL UNIQUE,
    quantidade INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    estoque_minimo INT NOT NULL DEFAULT 5 CHECK (estoque_minimo >= 0),
    PRIMARY KEY (cod_estoque),
    FOREIGN KEY (cod_produtos)
        REFERENCES produtos(cod_produtos)
);


-- ---------------------------------------------------------
-- 6. TABELA: VENDAS
-- ---------------------------------------------------------

CREATE TABLE vendas(
    cod_vendas INT NOT NULL AUTO_INCREMENT,
    cod_clientes INT,
    cod_vendedor INT NOT NULL,
    data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_venda DECIMAL(10,2) NOT NULL CHECK (valor_venda >= 0),
    PRIMARY KEY (cod_vendas),
    FOREIGN KEY (cod_clientes)
        REFERENCES clientes(cod_clientes),
    FOREIGN KEY (cod_vendedor)
        REFERENCES vendedores(cod_vendedor)
);


-- ---------------------------------------------------------
-- 7. TABELA: ITENS_VENDA
-- ---------------------------------------------------------

CREATE TABLE itens_venda(
    cod_item INT NOT NULL AUTO_INCREMENT,
    cod_vendas INT NOT NULL,
    cod_produtos INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    PRIMARY KEY (cod_item),
    FOREIGN KEY (cod_vendas)
        REFERENCES vendas(cod_vendas),
    FOREIGN KEY (cod_produtos)
        REFERENCES produtos(cod_produtos)
);


-- ---------------------------------------------------------
-- 8. TRIGGER: VALIDAR E DIMINUIR ESTOQUE
-- ---------------------------------------------------------
-- Antes de inserir um item de venda:
-- 1) verifica se o produto possui estoque cadastrado;
-- 2) verifica se há quantidade suficiente;
-- 3) diminui automaticamente o estoque.
-- ---------------------------------------------------------

DELIMITER $$

CREATE TRIGGER validar_e_diminuir_estoque
BEFORE INSERT ON itens_venda
FOR EACH ROW
BEGIN
    DECLARE estoque_atual INT;

    SELECT quantidade
    INTO estoque_atual
    FROM estoque
    WHERE cod_produtos = NEW.cod_produtos;

    IF estoque_atual IS NULL THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Produto nao possui estoque cadastrado';

    ELSEIF estoque_atual < NEW.quantidade THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Estoque insuficiente para realizar a venda';

    ELSE

        UPDATE estoque
        SET quantidade = quantidade - NEW.quantidade
        WHERE cod_produtos = NEW.cod_produtos;

    END IF;
END$$

DELIMITER ;


-- ---------------------------------------------------------
-- 9. DADOS DE TESTE: VENDEDORES
-- ---------------------------------------------------------

INSERT INTO vendedores (nome, email) VALUES
('Joao Silva', 'joao@essenzaperfumes.com'),
('Maria Oliveira', 'maria@essenzaperfumes.com'),
('Carlos Santos', 'carlos@essenzaperfumes.com');


-- ---------------------------------------------------------
-- 10. DADOS DE TESTE: PRODUTOS
-- ---------------------------------------------------------

INSERT INTO produtos (marca, nome, categoria, preco, codigo) VALUES
('Natura', 'Essencial Oud', 'Perfume Masculino', 189.90, 'PERF001'),
('O Boticario', 'Malbec Gold', 'Perfume Masculino', 159.90, 'PERF002'),
('Eudora', 'La Victorie', 'Perfume Feminino', 179.90, 'PERF003'),
('Natura', 'Kaiak', 'Perfume Masculino', 129.90, 'PERF004'),
('O Boticario', 'Floratta Red', 'Perfume Feminino', 149.90, 'PERF005');


-- ---------------------------------------------------------
-- 11. DADOS DE TESTE: ESTOQUE
-- ---------------------------------------------------------

INSERT INTO estoque (cod_produtos, quantidade, estoque_minimo) VALUES
(1, 15, 5),
(2, 20, 5),
(3, 10, 5),
(4, 25, 5),
(5, 12, 5);


-- ---------------------------------------------------------
-- 12. DADOS DE TESTE: CLIENTES
-- ---------------------------------------------------------

INSERT INTO clientes (nome, CPF, telefone, email, endereco) VALUES
('Ana Souza', '111.111.111-11', '(11) 99999-1111', 'ana@email.com', 'Rua das Flores, 100'),
('Bruno Costa', '222.222.222-22', '(11) 99999-2222', 'bruno@email.com', 'Rua dos Perfumes, 200'),
('Camila Ferreira', '333.333.333-33', '(11) 99999-3333', 'camila@email.com', 'Av. Central, 300'),
('Daniel Almeida', '444.444.444-44', '(11) 99999-4444', 'daniel@email.com', 'Rua Primavera, 400'),
('Juliana Martins', '555.555.555-55', '(11) 99999-5555', 'juliana@email.com', 'Av. Brasil, 500');

INSERT INTO vendas (cod_clientes, cod_vendedor, valor_venda) VALUES
(1, 1, 449.70);

INSERT INTO itens_venda
(cod_vendas, cod_produtos, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 1, 189.90, 189.90),
(1, 4, 2, 129.90, 259.80);


INSERT INTO vendas (cod_clientes, cod_vendedor, valor_venda) VALUES
(2, 2, 489.70);

INSERT INTO itens_venda
(cod_vendas, cod_produtos, quantidade, preco_unitario, subtotal) VALUES
(2, 2, 1, 159.90, 159.90),
(2, 5, 1, 149.90, 149.90),
(2, 3, 1, 179.90, 179.90);


-- ---------------------------------------------------------
-- 15. CONSULTAS DE TESTE
-- ---------------------------------------------------------

-- Ver todos os clientes
SELECT * FROM clientes;

-- Ver todos os vendedores
SELECT * FROM vendedores;

-- Ver todos os produtos
SELECT * FROM produtos;

-- Ver estoque
SELECT * FROM estoque;

-- Ver vendas
SELECT * FROM vendas;

-- Ver itens das vendas
SELECT * FROM itens_venda;

-- Consulta completa de vendas
SELECT
    v.cod_vendas,
    c.nome AS cliente,
    ve.nome AS vendedor,
    v.data_venda,
    p.nome AS produto,
    iv.quantidade,
    iv.preco_unitario,
    iv.subtotal
FROM vendas v
LEFT JOIN clientes c
    ON v.cod_clientes = c.cod_clientes
INNER JOIN vendedores ve
    ON v.cod_vendedor = ve.cod_vendedor
INNER JOIN itens_venda iv
    ON v.cod_vendas = iv.cod_vendas
INNER JOIN produtos p
    ON iv.cod_produtos = p.cod_produtos
ORDER BY v.cod_vendas;


-- Consulta de produtos e estoque
SELECT
    p.cod_produtos,
    p.nome,
    p.marca,
    p.categoria,
    p.preco,
    e.quantidade,
    e.estoque_minimo
FROM produtos p
INNER JOIN estoque e
    ON p.cod_produtos = e.cod_produtos
ORDER BY p.nome;
