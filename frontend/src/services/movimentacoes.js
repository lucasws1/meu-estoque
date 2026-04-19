import api from "./api";

export const listarMovimentacoes = async (params) =>
  api.get("/movimentacoes", {
    params,
  });

export const obterMovimentacao = async (id) => api.get(`/movimentacoes/${id}`);

export const criarMovimentacao = async (dados) =>
  api.post("/movimentacoes", dados);

export const atualizarMovimentacao = async (id, dados) =>
  api.put(`/movimentacoes/${id}`, dados);

export const deletarMovimentacao = async (id) =>
  api.delete(`/movimentacoes/${id}`);
