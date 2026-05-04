import ModalMovimentacoes from "@/components/ModalMovimentacoes";
import ModalProduto from "@/components/ModalProduto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ArrowLeft,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ClipboardPen,
  ExternalLink,
  ExternalLinkIcon,
  Info,
  Loader2,
  Package,
  Pencil,
  Plus,
  Shirt,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TabInfo({ produto }) {
  return (
    <div className="flex w-full justify-center gap-6 md:max-w-7xl">
      <div className="mx-auto flex w-full gap-4 md:max-w-7xl">
        <div className="mr-20 flex flex-col gap-4">
          <div key={produto?.nome} className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-1.5 truncate font-medium tracking-wide uppercase">
              <Shirt className="size-3.5" />
              Produto
            </span>
            <span className="text-foreground text-sm">{produto.nome}</span>
          </div>

          <div key={produto?.preco_custo} className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-1.5 truncate font-medium tracking-wide uppercase">
              <BanknoteArrowDown className="size-3.5" />
              Preço de Custo
            </span>
            <span className="text-foreground text-sm">
              {Number(produto.preco_custo ?? 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <div key={produto?.preco_venda} className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-1.5 truncate font-medium tracking-wide uppercase">
              <BanknoteArrowUp className="size-3.5" />
              Preço de Venda
            </span>
            <span className="text-foreground text-sm">
              {Number(produto.preco_venda ?? 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div
            key={produto?.quantidade_estoque}
            className="flex flex-col gap-1"
          >
            <span className="text-muted-foreground flex max-w-xs items-center gap-1.5 truncate font-medium tracking-wide uppercase">
              <Package className="size-3.5" />
              Estoque
            </span>
            <span className="text-foreground text-sm">
              {produto.quantidade_estoque}
            </span>
          </div>

          <div
            key={produto?.criado_em}
            className="col-span-1 flex flex-col gap-1"
          >
            <span className="text-muted-foreground flex max-w-xs items-center gap-1.5 truncate font-medium tracking-wide uppercase">
              <Info className="size-3.5" />
              Criado em
            </span>
            <span className="text-foreground text-sm">
              {new Date(produto.criado_em).toLocaleDateString("pt-BR")}
            </span>
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
    <div className="mx-auto flex w-full flex-col gap-2 xl:w-7xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {movimentacoes.length}{" "}
          {movimentacoes.length === 1 ? "movimentação" : "movimentações"}
        </span>
        <Button
          size="sm"
          onClick={() => {
            setModoEdicao(null);
            setAberto(true);
          }}
        >
          <Plus /> Movimentar
        </Button>
      </div>
      <div className="border-border overflow-x-auto rounded-lg border">
        <table className="w-full overflow-x-auto text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">Tipo</th>
              <th className="px-4 py-2.5 text-left font-medium">Quantidade</th>
              <th className="px-4 py-2.5 text-left font-medium">Preço</th>
              <th className="px-4 py-2.5 text-left font-medium">Data</th>
              <th className="px-4 py-2.5 text-left font-medium">Observação</th>
              <th className="py-2.5 pr-10 pl-4 text-right font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((mov) => (
              <tr key={mov.id} className="border-border border-b">
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
                        <div className="flex w-80 cursor-pointer items-center gap-1 text-sm">
                          <span className="block truncate">
                            {mov.observacao}
                          </span>
                          <div>
                            <ExternalLinkIcon className="size-3" />
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
                    "-"
                  )}
                </td>
                <td className="px-4 py-2.5 text-right">
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
                    className="text-red-500"
                  >
                    <Trash2 />
                  </Button>
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-start justify-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate(-1)} title="Voltar">
              <ArrowLeft />
            </Button>
            <h1 className="text-xl font-semibold">
              {produto?.nome || "Produto Sem Nome"}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setModoEdicao(produto);
                setAberto(true);
              }}
            >
              <Pencil />
            </Button>
          </div>
          <div className="flex items-center gap-2 pl-8">
            <Badge variant="outline" className="font-mono">
              {produto?.quantidade_estoque} unid. em estoque
            </Badge>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="align-center mx-auto flex max-w-[90%] items-center justify-center xl:max-w-7xl">
        <Tabs defaultValue="info" className="flex w-full gap-4">
          <TabsList>
            <TabsTrigger value="info">
              <Info />
              Informações
            </TabsTrigger>
            <TabsTrigger value="movimentacoes">
              <ClipboardPen />
              Movimentações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <TabInfo produto={produto} />
          </TabsContent>

          <TabsContent value="movimentacoes">
            <TabMovimentacoes movimentacoes={movimentacoes} produto={produto} />
          </TabsContent>
        </Tabs>
        <ModalProduto
          key={modoEdicao?.id ?? "novo"}
          aberto={aberto}
          onFechar={() => setAberto(false)}
          modoEdicao={modoEdicao}
          onSalvar={handleSalvar}
        />
      </div>
    </div>
  );
}
