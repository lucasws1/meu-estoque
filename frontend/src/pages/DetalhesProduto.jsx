import ModalMovimentacoes from "@/components/ModalMovimentacoes";
import ModalProduto from "@/components/ModalProduto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="flex w-full md:max-w-7xl justify-center gap-6">
      <div className="flex gap-4 w-full md:max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mr-20">
          <div key={produto?.nome} className="flex flex-col gap-1">
            <span className="flex items-center truncate gap-1.5 text-muted-foreground font-medium uppercase tracking-wide">
              <Shirt className="size-3.5" />
              Produto
            </span>
            <span className="text-sm text-foreground">{produto.nome}</span>
          </div>

          <div key={produto?.preco_custo} className="flex flex-col gap-1">
            <span className="flex items-center truncate gap-1.5 text-muted-foreground font-medium uppercase tracking-wide">
              <BanknoteArrowDown className="size-3.5" />
              Preço de Custo
            </span>
            <span className="text-sm text-foreground">
              {Number(produto.preco_custo ?? 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <div key={produto?.preco_venda} className="flex flex-col gap-1">
            <span className="flex items-center truncate gap-1.5 text-muted-foreground font-medium uppercase tracking-wide">
              <BanknoteArrowUp className="size-3.5" />
              Preço de Venda
            </span>
            <span className="text-sm text-foreground">
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
            <span className="flex items-center truncate gap-1.5 text-muted-foreground font-medium uppercase tracking-wide max-w-xs">
              <Package className="size-3.5" />
              Estoque
            </span>
            <span className="text-sm text-foreground">
              {produto.quantidade_estoque}
            </span>
          </div>

          <div
            key={produto?.criado_em}
            className="flex flex-col gap-1 col-span-1"
          >
            <span className="flex items-center truncate gap-1.5 text-muted-foreground font-medium uppercase tracking-wide max-w-xs">
              <Info className="size-3.5" />
              Criado em
            </span>
            <span className="text-sm text-foreground">
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
        const { data: movs } = await listarMovimentacoes({ produto_id: dados.produto_id });
        setMovimentacoes(movs);
      } catch (error) {
        alert("Não foi possível atualizar a movimentação.");
      }
    } else {
      try {
        await criarMovimentacao(dados);
        setAberto(false);
        const { data: novasMovs } = await listarMovimentacoes({ produto_id: dados.produto_id });
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
    <div className="flex flex-col xl:w-7xl mx-auto w-full gap-2">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
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
          <Plus /> Nova movimentação
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="w-full overflow-x-auto text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Produto</th>
              <th className="text-left px-4 py-2.5 font-medium">Tipo</th>
              <th className="text-left px-4 py-2.5 font-medium">Quantidade</th>
              <th className="text-left px-4 py-2.5 font-medium">Preço</th>
              <th className="text-left px-4 py-2.5 font-medium">Data</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((mov) => (
              <tr key={mov.id} className="border-b border-border">
                <td className="px-4 py-2.5">
                  {produto.nome || "Produto não encontrado"}
                </td>
                <td className="px-4 py-2.5">{mov.tipo}</td>
                <td className="px-4 py-2.5">{mov.quantidade}</td>
                <td className="px-4 py-2.5">
                  {Number(mov.preco_unitario).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="px-4 py-2.5">
                  {new Date(mov.data_movimentacao).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2.5">
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex items-start justify-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate(-1)} title="Voltar">
              <ArrowLeft />
            </Button>
            <h1 className="text-xl font-semibold">
              {produto?.nome || "Produto Sem Nome"}
            </h1>
          </div>
          <div className="flex items-center gap-2 pl-8">
            <Badge variant="outline" className="font-mono">
              {movimentacoes.length}{" "}
              {movimentacoes.length === 1 ? "movimentação" : "movimentações"}
            </Badge>
            <Button
              variant="ghost"
              onClick={() => {
                setModoEdicao(produto);
                setAberto(true);
              }}
            >
              <Pencil /> Editar
            </Button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="max-w-[90%] items-center align-center flex justify-center xl:max-w-7xl mx-auto">
        <Tabs defaultValue="info" className="w-full flex gap-4">
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
