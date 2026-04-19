import api from "./api";

export const fazerLogin = (credenciais) => api.post("/auth/login", credenciais);
