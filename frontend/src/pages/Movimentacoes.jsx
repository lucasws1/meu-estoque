import ModalMovimentacoes from "@/components/ModalMovimentacoes";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  atualizarMovimentacao,
  criarMovimentacao,
  deletarMovimentacao,
  listarMovimentacoes,
} from "@/services/movimentacoes";
import { listarProdutos } from "@/services/produtos";
import { format } from "date-fns";
import {
  CalendarIcon,
  ExternalLink,
  Eye,
  Loader2,
  Pencil,
  SearchX,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TIPOS = ["entrada", "saida"];

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [filtroProduto, setFiltroProduto] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");
  const [aberto, setAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(null);
  const [date, setDate] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const { data } = await listarProdutos();
        setProdutos(data);
      } catch (error) {
        setErroLista("Erro ao carregar produtos");
      } finally {
        setCarregando(false);
      }
    };

    const carregarMovimentacoes = async () => {
      try {
        const params = {};
        if (filtroProduto) params.produto_id = filtroProduto;
        if (filtroTipo) params.tipo = filtroTipo;
        if (date?.from) params.data_from = format(date.from, "yyyy-MM-dd");
        if (date?.to) params.data_to = format(date.to, "yyyy-MM-dd");

        const { data } = await listarMovimentacoes(params);
        setMovimentacoes(data);
      } catch (error) {
        setErroLista("Não foi possível carregar as movimentações.");
      } finally {
        setCarregando(false);
      }
    };
    carregarProdutos();
    carregarMovimentacoes();
  }, [filtroProduto, filtroTipo, date]);

  const limparFiltros = () => {
    setDate(null);
    setFiltroProduto("");
    setFiltroTipo("");
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await deletarMovimentacao(id);
      setMovimentacoes((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Não foi possível excluir o produto");
    }
  };

  const handleSalvar = async (dados) => {
    console.log(JSON.stringify(dados, null, 2));
    if (modoEdicao) {
      await atualizarMovimentacao(modoEdicao.id, dados);
    } else {
      await criarMovimentacao(dados);
    }

    setCarregando(true);
    setErroLista("");
    try {
      const { data } = await listarMovimentacoes();
      setMovimentacoes(data);
    } catch (error) {
      setErroLista("Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mx-auto flex w-[90%] flex-col gap-6 xl:w-full xl:max-w-7xl">
      <div className="flex w-full flex-col justify-between gap-6 xl:flex-row">
        <div className="flex w-full items-center gap-6 xl:justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">Movimentações</h1>
            <p className="text-muted-foreground text-sm">
              Gerencie seu estoque
            </p>
          </div>

          <Button
            className="max-w-42 items-center"
            onClick={() => {
              setModoEdicao(null);
              setAberto(true);
            }}
          >
            Nova movimentação
          </Button>
        </div>
        {/* Buscar movimentações
        [Produto ▾]  [Tipo ▾]  [De: ____]  [Até: ____]  [Limpar filtros] */}
        <div className="flex w-full items-center">
          <div className="flex w-full items-center gap-4">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <Select value={filtroProduto} onValueChange={setFiltroProduto}>
                <SelectTrigger className="w-38 lg:w-42">
                  <SelectValue placeholder="Produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {produtos.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-38 lg:w-42">
                  <SelectValue placeholder="Tipo movim." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TIPOS.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo.toString().charAt(0).toUpperCase() +
                          tipo.toString().slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <Field className="mx-auto w-42 truncate">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-range"
                      className="justify-start px-2.5 font-normal"
                    >
                      <CalendarIcon />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              <Button
                variant="destructive"
                className="w-42"
                onClick={limparFiltros}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Tabela de movimentações */}
      <div className="border-border w-full overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Produto</th>
              <th className="px-4 py-3 text-left font-medium">Tipo</th>
              <th className="px-4 py-3 text-left font-medium">Quantidade</th>
              <th className="px-4 py-3 text-left font-medium">Preço</th>
              <th className="px-4 py-3 text-left font-medium">Data</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td
                  colSpan={6}
                  className="text-muted-foreground px-4 py-10 text-center"
                >
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </td>
              </tr>
            )}

            {!carregando && erroLista && (
              <tr>
                <td
                  colSpan={6}
                  className="text-destructive px-4 py-10 text-center"
                >
                  {erroLista}
                </td>
              </tr>
            )}

            {!carregando && !erroLista && movimentacoes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <SearchX className="size-8" />
                    <span className="text-sm">
                      Nenhuma movimentação encontrada.
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {!carregando &&
              !erroLista &&
              movimentacoes.map((mov) => (
                <tr key={mov.id} className="border-t">
                  <td className="px-4 py-3">{mov.id}</td>
                  <td className="cursor-pointer px-4 py-3">
                    <Link
                      to={`/produtos/${mov.produto_id}`}
                      className="flex items-center gap-3"
                    >
                      {mov.nome_produto}{" "}
                      <ExternalLink className="size-3 text-gray-400" />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}
                  </td>
                  <td className="px-4 py-3">{mov.quantidade}</td>
                  <td className="px-4 py-3">
                    {Number(mov.preco_unitario ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {format(new Date(mov.data_movimentacao), "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setModoEdicao(mov);
                          setAberto(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExcluir(mov.id)}
                      >
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {movimentacoes.length > 0 && !carregando && (
        <p className="text-muted-foreground text-xs">
          {movimentacoes.length}{" "}
          {movimentacoes.length === 1 ? "movimentação" : "movimentações"}{" "}
          encontrada{movimentacoes.length === 1 ? "" : "s"}
        </p>
      )}
      <Button
        className="cursor mx-auto w-24 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>

      <ModalMovimentacoes
        key={modoEdicao?.id ?? "novo"}
        aberto={aberto}
        onFechar={() => setAberto(false)}
        modoEdicao={modoEdicao}
        onSalvar={handleSalvar}
        produtos={produtos}
      />
    </div>
  );
}
