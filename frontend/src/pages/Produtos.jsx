import ModalCompraVenda from "@/components/ModalCompraVenda";
import ModalProduto from "@/components/ModalProduto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { criarMovimentacao } from "@/services/movimentacoes";
import {
  atualizarProduto,
  criarProduto,
  deletarProduto,
  listarProdutos,
} from "@/services/produtos";
import {
  Banknote,
  Loader2,
  Pencil,
  Search,
  SearchX,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [abertoCompraVenda, setAbertoCompraVenda] = useState(false);
  const [produto, setProduto] = useState(null);
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

  const handleSalvarCompraVenda = async (dados) => {
    setCarregando(true);
    setErroLista("");
    try {
      const { data } = await criarMovimentacao(dados);

      const quantidade = (produto) =>
        data.tipo === "entrada"
          ? produto.quantidade_estoque + Number(data.quantidade)
          : produto.quantidade_estoque - Number(data.quantidade);

      setProdutos((prev) =>
        prev.map((p) =>
          p.id === data.produto_id
            ? {
                ...p,
                quantidade_estoque: quantidade(p),
              }
            : p,
        ),
      );
    } catch (error) {
      setErroLista("Não foi possível salvar a movimentação.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-[90%] xl:w-full xl:max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between lg:items-end">
        <div className="flex flex-col w-full gap-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Produtos</h1>
              <p className="text-sm text-muted-foreground truncate">
                Gerencie os seus produtos.
              </p>
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
          {/* Buscar produtos */}
          <div className="relative flex w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Tabela de produtos */}
      <div className="rounded-lg border border-border overflow-x-auto">
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
                  <td className="px-4 py-3 font-medium cursor-pointer">
                    <Link to={`/produtos/${p.id}`}>{p.id}</Link>
                  </td>

                  <td className="px-4 py-3 font-medium cursor-pointer">
                    <Link to={`/produtos/${p.id}`}>{p.nome}</Link>
                  </td>
                  <td className="px-4 py-3">{p.quantidade_estoque || "—"}</td>
                  <td className="px-4 py-3">
                    {Number(p.preco_custo ?? 0)?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {Number(p.preco_venda ?? 0)?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 justify-end w-full flex">
                    <div className="flex">
                      {/* Dialog for quick sell/buy*/}

                      <Button
                        variant="ghost"
                        onClick={() => {
                          setAbertoCompraVenda(true);
                          setProduto(p);
                        }}
                      >
                        <Banknote className="text-green-300 size-5" />
                      </Button>

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
      <ModalCompraVenda
        aberto={abertoCompraVenda}
        onFechar={() => setAbertoCompraVenda(false)}
        onSalvar={handleSalvarCompraVenda}
        produto={produto}
      />
    </div>
  );
}
