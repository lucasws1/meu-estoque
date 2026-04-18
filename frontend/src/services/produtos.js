import api from "./api";

export const listarProdutos = async (busca) =>
  api.get("/produtos", { params: busca ? { nome: busca } : undefined });

export const obterProduto = async (id) => api.get(`/produtos/${id}`);

export const criarProduto = async (dados) => api.post("/produtos", dados);

export const atualizarProduto = async (id, dados) =>
  api.put(`/produtos/${id}`, dados);

export const deletarProduto = async (id) => api.delete(`/produtos/${id}`);
