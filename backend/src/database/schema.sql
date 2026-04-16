CREATE DATABASE IF NOT EXISTS meu_estoque CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE meu_estoque;
-- ------------------------------------------------------------
-- PRODUTOS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco_custo DECIMAL(10, 2) NOT NULL,
  preco_venda DECIMAL(10, 2) NOT NULL,
  quantidade_estoque INT NOT NULL DEFAULT 0 CHECK (quantidade_estoque >= 0),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ------------------------------------------------------------
-- MOVIMENTACOES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movimentacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produto_id INT NOT NULL,
  tipo ENUM('entrada', 'saida') NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observacao TEXT,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);