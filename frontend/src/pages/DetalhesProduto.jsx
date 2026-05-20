import ModalMovimentacoes from "@/components/ModalMovimentacoes";
import ModalProduto from "@/components/ModalProduto";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  atualizarMovimentacao,
  criarMovimentacao,
  deletarMovimentacao,
  listarMovimentacoes,
} from "@/services/movimentacoes";
import { atualizarProduto, obterProduto } from "@/services/produtos";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ClipboardPen,
  ExternalLinkIcon,
  Loader2,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TabInfo({ movimentacoes, produto }) {
  const entradas = movimentacoes.filter((m) => m.tipo === "entrada").length;
  const saidas = movimentacoes.filter((m) => m.tipo === "saida").length;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="bg-muted/10 flex flex-col gap-1 rounded-lg border p-4">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase">
          <BanknoteArrowDown className="size-3.5" />
          Preço de Custo
        </span>
        <span className="text-foreground text-base font-semibold">
          {Number(produto.preco_custo ?? 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>

      <div className="bg-muted/10 flex flex-col gap-1 rounded-lg border p-4">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase">
          <BanknoteArrowUp className="size-3.5" />
          Preço de Venda
        </span>
        <span className="text-foreground text-base font-semibold">
          {Number(produto.preco_venda ?? 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>

      <div className="bg-muted/10 flex flex-col gap-1 rounded-lg border p-4">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase">
          <Package className="size-3.5" />
          Estoque
        </span>
        <span className="text-foreground text-base font-semibold">
          {produto.quantidade_estoque} un.
        </span>
      </div>

      <div className="bg-muted/10 flex flex-col gap-2 rounded-lg border p-4">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase">
          <ClipboardPen className="size-3.5" />
          {movimentacoes.length === 1 ? "Movimentação" : "Movimentações"}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-foreground text-base font-semibold">
            {movimentacoes.length}
          </span>
          <div className="flex items-center gap-2 text-sm">
            {entradas > 0 && (
              <span className="flex items-center gap-0.5 text-green-500">
                <ArrowDown className="size-3.5" />
                {entradas}
              </span>
            )}
            {saidas > 0 && (
              <span className="flex items-center gap-0.5 text-red-500">
                <ArrowUp className="size-3.5" />
                {saidas}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabMovimentacoes({ movimentacoes: movs, produto }) {
  const [modoEdicao, setModoEdicao] = useState();
  const [movimentacoes, setMovimentacoes] = useState(movs || []);
  const [aberto, setAberto] = useState(false);

  const handleSalvar = async (dados) => {
    if (modoEdicao) {
      try {
        await atualizarMovimentacao(modoEdicao.id, dados);
        setModoEdicao(null);
        setAberto(false);
        const { data: movs } = await listarMovimentacoes({
          produto_id: dados.produto_id,
        });
        setMovimentacoes(movs);
      } catch (error) {
        alert("Não foi possível atualizar a movimentação.");
      }
    } else {
      try {
        await criarMovimentacao(dados);
        setAberto(false);
        const { data: novasMovs } = await listarMovimentacoes({
          produto_id: dados.produto_id,
        });
        setMovimentacoes(novasMovs);
      } catch (error) {
        alert("Não foi possível criar a movimentação.");
      }
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta movimentação?")) {
      try {
        await deletarMovimentacao(id);
        setMovimentacoes((prev) => prev.filter((m) => m.id !== id));
      } catch (error) {
        alert("Não foi possível excluir a movimentação.");
      }
    }
  };

  return (
    <div className="mx-auto flex w-full min-w-fit flex-col gap-2">
      <div className="border-border overflow-x-auto rounded-lg border">
        <table className="w-full overflow-x-auto text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">Tipo</th>
              <th className="px-4 py-2.5 text-left font-medium">Quantidade</th>
              <th className="px-4 py-2.5 text-left font-medium">Preço</th>
              <th className="px-4 py-2.5 text-left font-medium">Data</th>
              <th className="px-4 py-2.5 text-left font-medium">Observação</th>
              <th className="px-4 py-2.5 text-center font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((mov) => (
              <tr
                key={mov.id}
                className="border-border even:bg-muted/30 border-b"
              >
                <td className="px-4 py-2.5">
                  {mov.tipo.toString().charAt(0).toUpperCase() +
                    mov.tipo.toString().slice(1)}
                </td>
                <td className="px-4 py-2.5">
                  {mov.tipo === "entrada" ? (
                    <span className="text-green-500">+{mov.quantidade}</span>
                  ) : (
                    <span className="text-red-500">-{mov.quantidade}</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  {Number(mov.preco_unitario).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="px-4 py-2.5">
                  {new Date(mov.data_movimentacao).toLocaleDateString("pt-BR")}
                </td>
                <td className="w-80 py-2">
                  {mov.observacao ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div
                          className="flex w-80 cursor-pointer items-center gap-1 text-sm"
                          title="Clique para ver completo"
                        >
                          <span className="block truncate underline decoration-dotted underline-offset-2">
                            {mov.observacao}
                          </span>
                          <div className="shrink-0">
                            <ExternalLinkIcon className="text-muted-foreground size-3" />
                          </div>
                        </div>
                      </PopoverTrigger>

                      <PopoverContent className="w-72">
                        <p className="text-sm whitespace-pre-wrap">
                          {mov.observacao}
                        </p>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setModoEdicao(mov);
                        setAberto(true);
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExcluir(mov.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <ModalMovimentacoes
          key={modoEdicao?.id ?? "novo"}
          aberto={aberto}
          onFechar={() => setAberto(false)}
          modoEdicao={modoEdicao}
          onSalvar={handleSalvar}
          produtos={produto ? [produto] : []}
        />
      </div>
    </div>
  );
}

export default function DetalhesProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const TIPOS = ["entrada", "saída"];
  console.log(TIPOS);

  const [produto, setProduto] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aberto, setAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        const { data: prod } = await obterProduto(id);
        const { data: mov } = await listarMovimentacoes({ produto_id: id });
        setProduto(prod);
        setMovimentacoes(mov);
        setCarregando(false);
      } catch (error) {
        setErro("Não foi possível carregar os detalhes do produto.");
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, [id]);

  const handleSalvar = async (dados) => {
    if (modoEdicao) {
      try {
        await atualizarProduto(modoEdicao.id, dados);
        const { data: prod } = await obterProduto(id);
        setProduto(prod);
        setModoEdicao(null);
        setAberto(false);
      } catch (error) {
        alert("Não foi possível atualizar o produto.");
        return;
      }
    } else {
      console.log("Não é possível criar produto por esta página.");
    }
  };

  if (carregando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[90%] flex-col gap-6 xl:max-w-7xl">
      {/* Cabeçalho alinhado ao mesmo container do conteúdo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            title="Voltar"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-semibold">
            {produto?.nome || "Produto Sem Nome"}
          </h1>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2"
            variant="outline"
            size="sm"
            onClick={() => {
              setModoEdicao(produto);
              setAberto(true);
            }}
          >
            <Pencil /> Editar Produto
          </Button>
          <Button
            className="flex items-center gap-2"
            size="sm"
            onClick={() => {
              setModoEdicao(null);
              setAberto(true);
            }}
          >
            <Plus /> Movimentar
          </Button>
        </div>
      </div>

      {/* Cards de métricas */}
      <TabInfo movimentacoes={movimentacoes} produto={produto} />

      {/* Tabela de movimentações */}
      <TabMovimentacoes movimentacoes={movimentacoes} produto={produto} />

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
