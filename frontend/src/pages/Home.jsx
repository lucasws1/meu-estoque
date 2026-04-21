import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listarMovimentacoes } from "@/services/movimentacoes";
import { listarProdutos } from "@/services/produtos";
import {
  ArrowDownUp,
  ArrowRight,
  CalendarDays,
  DollarSign,
  Gavel,
  Loader2,
  MoveDown,
  MoveUp,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CardContador({ icon: Icon, label, valor, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-3 rounded-xl bg-card ring-1 ring-foreground/10 p-5 text-left transition-colors hover:bg-muted/30 w-full"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">
          {label}
        </span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-semibold tracking-tight truncate">
          {valor ?? <Loader2 className="animate-spin size-5" />}
        </span>
        {sub && (
          <span className="text-xs text-muted-foreground mb-1">{sub}</span>
        )}
      </div>
    </button>
  );
}

function TabelaProdutos({ produtos, movimentacoes = null, navigate }) {
  if (movimentacoes) {
    produtos = movimentacoes.map((mov) => ({
      id: mov.id,
      nome: `${produtos.find((p) => p.id === mov.produto_id)?.nome || "Produto Desconecido"}`,
      quantidade_estoque: mov.quantidade,
      preco_venda: mov.preco_unitario,
      preco_custo: mov.preco_unitario,
      criado_em: mov.data_movimentacao,
      tipo: mov.tipo,
    }));
  }

  return (
    <div className="grid gap-3">
      {produtos.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Nenhum produto recente.
        </p>
      ) : (
        <div className="grid divide-y divide-border">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="flex items-center gap-3 py-3 group cursor-pointer"
              onClick={() => navigate(`/produtos/${produto.id}`)}
            >
              <div className="grid gap-1 flex-1 w-full min-w-0">
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 items-center">
                      <Package className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate">
                        {produto.nome}
                      </span>
                    </div>

                    <span className="text-xs">
                      x {produto.quantidade_estoque}
                    </span>
                  </div>

                  {movimentacoes && (
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={produto.tipo === "entrada" ? "outline" : ""}
                      >
                        {produto.tipo === "entrada" ? (
                          <>
                            <MoveDown className="size-3" /> Entrada
                          </>
                        ) : (
                          <>
                            <MoveUp className="size-3" /> Saída
                          </>
                        )}
                      </Badge>
                    </div>
                  )}

                  {movimentacoes ? (
                    <>
                      <span className="text-xs">
                        {(
                          produto.quantidade_estoque *
                          Number(produto?.preco_venda)
                        ).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span className="text-muted-foreground text-xs items-center">
                        {Number(produto?.preco_custo).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs">
                        {Number(produto?.preco_venda).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span className="text-muted-foreground text-xs items-center">
                        {Number(produto?.preco_custo).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </>
                  )}

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs truncate">
                      {new Date(produto.criado_em).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [produtos, setProdutos] = useState(null);
  const [movimentos, setMovimentos] = useState(null);
  const [produtosRecentes, setProdutosRecentes] = useState([]);
  const [movimentosRecentes, setMovimentosRecentes] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      try {
        const [{ data: prods }, { data: movs }] = await Promise.all([
          listarProdutos(),
          listarMovimentacoes(),
        ]);
        setProdutos(prods);
        setMovimentos(movs);

        const produtosOrdenados = [...prods].sort(
          (a, b) => new Date(b.criado_em) - new Date(a.criado_em),
        );

        const movimentosOrdenados = [...movs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setProdutosRecentes(produtosOrdenados.slice(0, 5));
        setMovimentosRecentes(movimentosOrdenados.slice(0, 5));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const valorTotalEstoque =
    produtos?.reduce(
      (acc, produto) => acc + produto.preco_venda * produto.quantidade_estoque,
      0,
    ) -
    produtos?.reduce(
      (acc, produto) => acc + produto.preco_custo * produto.quantidade_estoque,
      0,
    );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Painel</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Visão geral dos produtos e movimentações recentes.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CardContador
          icon={Package}
          label="Produtos"
          valor={produtos?.length}
          onClick={() => navigate("/produtos")}
        />
        <CardContador
          icon={MoveUp}
          label="Vendas"
          valor={movimentos?.filter((m) => m.tipo === "saida").length}
          onClick={() => navigate("/movimentacoes")}
        />
        <CardContador
          icon={MoveDown}
          label="Compras"
          valor={movimentos?.filter((m) => m.tipo === "entrada").length}
          onClick={() => navigate("/movimentacoes")}
        />
        <CardContador
          icon={DollarSign}
          label="Valor Total em Estoque"
          valor={valorTotalEstoque?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          onClick={() => navigate("/movimentacoes")}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="size-4" /> Produtos recentes
                </CardTitle>
                <CardDescription>Últimos produtos adicionados</CardDescription>
              </div>
              <Button
                className="text-muted-foreground"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/produtos")}
              >
                Ver todos <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="animate-spin size-5 text-muted-foreground" />
              </div>
            ) : (
              <TabelaProdutos produtos={produtosRecentes} navigate={navigate} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="size-4" />
                  Movimentações recentes
                </CardTitle>
                <CardDescription>Últimos 30 dias</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/movimentacoes")}
                className="text-muted-foreground"
              >
                Ver todas <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin size-5 text-muted-foreground" />
              </div>
            ) : (
              <TabelaProdutos
                produtos={produtos}
                movimentacoes={movimentosRecentes}
                navigate={navigate}
                vazio="Nenhuma movimentação nos últimos 30 dias."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
