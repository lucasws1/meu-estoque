import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  atualizarProduto,
  criarProduto,
  deletarProduto,
  listarProdutos,
} from "@/services/produtos";
import { Loader2, Pencil, Search, SearchX, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalProduto from "@/components/ModalProduto";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setCarregando(true);
      try {
        const { data } = await listarProdutos(busca);
        setProdutos(data);
      } catch (error) {
        setErroLista("Não foi possível carregar os produtos.");
      } finally {
        setCarregando(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [busca]);

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await deletarProduto(id);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Não foi possível excluir o produto.");
    }
  };

  const handleSalvar = async (dados) => {
    if (modoEdicao) {
      await atualizarProduto(modoEdicao.id, dados);
    } else {
      await criarProduto(dados);
    }

    setCarregando(true);
    setErroLista("");
    try {
      const { data } = await listarProdutos();
      setProdutos(data);
    } catch (error) {
      setErroLista("Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie aqui os seus produtos.
          </p>
        </div>
        {/* Buscar produtos */}
        <div className="relative flex flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              setModoEdicao(null);
              setAberto(true);
            }}
          >
            + Novo Produto
          </Button>
        </div>
      </div>
      {/* Tabela de produtos */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Nome</th>
              <th className="px-4 py-3 text-left font-medium">Estoque</th>
              <th className="px-4 py-3 text-left font-medium">Preço Custo</th>
              <th className="px-4 py-3 text-left font-medium">Preço Venda</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  <Loader2 className="animate-spin mx-auto size-5" />
                </td>
              </tr>
            )}

            {!carregando && erroLista && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-destructive"
                >
                  {erroLista}
                </td>
              </tr>
            )}

            {!carregando && !erroLista && produtos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <SearchX className="size-8" />
                    <span className="text-sm">
                      {busca
                        ? "Nenhum produto encontrado para essa busca."
                        : "Nenhum produto cadastrado."}
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {!carregando &&
              produtos.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link to={`/produtos/${p.id}`}>{p.id}</Link>
                  </td>

                  <td className="px-4 py-3 font-medium">
                    <Link to={`/produtos/${p.id}`}>{p.nome}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.quantidade_estoque || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    R${" "}
                    {p.preco_custo?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    R${" "}
                    {p.preco_venda?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => {
                          setModoEdicao(p);
                          setAberto(true);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExcluir(p.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {produtos.length > 0 && !carregando && (
        <p className="text-xs text-muted-foreground">
          {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}{" "}
          encontrado{produtos.length === 1 ? "" : "s"}.
        </p>
      )}
      <Button
        className="cursor-pointer hover:underline w-24 mx-auto"
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>

      {/* Modal */}
      <ModalProduto
        key={modoEdicao?.id ?? "novo"}
        aberto={aberto}
        onFechar={() => setAberto(false)}
        modoEdicao={modoEdicao}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
