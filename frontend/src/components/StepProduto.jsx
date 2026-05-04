import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRightIcon, Search } from "lucide-react";

const TIPOS = ["entrada", "saida"];

export default function StepProduto({ valores, onChange, erro, produtos }) {
  const [produtoSelecionado, setProdutoSelecionado] = useState(
    valores.produto_id || null,
  );
  const [busca, setBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState(produtos || []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const searchResult = (produtos || []).filter((produto) =>
        String(produto.nome)
          .toLowerCase()
          .includes(String(busca).toLowerCase()),
      );
      if (searchResult.length === 0) {
        setProdutosFiltrados(produtos || []);
      } else {
        setProdutosFiltrados(searchResult);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [busca, produtos]);

  return (
    <div className="mt-4 flex flex-col">
      {erro && (
        <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border px-3 py-2 text-sm">
          {erro}
        </p>
      )}
      <div className="flex flex-col">
        <Field>
          <FieldLabel className="mt-4">Qual produto?</FieldLabel>
          <div className="relative mb-4 w-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="size-10 w-full pl-8"
              placeholder="Digite o nome do produto..."
            />
          </div>

          <ToggleGroup
            type="single"
            orientation="vertical"
            value={produtoSelecionado}
            onValueChange={(value) => {
              setProdutoSelecionado(value);
              onChange("produto_id", value);
              onChange(
                "preco_unitario",
                produtos.find((p) => p.id === value)?.preco_venda,
              );
            }}
            variant="outline"
            spacing={2}
          >
            <div className="relative">
              <div className="flex h-64 w-80 flex-col gap-2 overflow-y-auto [scrollbar-width:none] md:w-86">
                {produtosFiltrados.map((produto) => (
                  <ToggleGroupItem
                    key={produto.id}
                    value={produto.id}
                    aria-label={produto.nome}
                    className="relative flex size-16 w-full flex-col items-start justify-center rounded-xl px-4"
                  >
                    <span className="text-[16px] leading-none">
                      {produto.nome}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Estoque: {produto.quantidade_estoque} un. ·{" "}
                      {Number(produto.preco_venda).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                    <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                      <ChevronRightIcon />
                    </span>
                  </ToggleGroupItem>
                ))}
              </div>
              {produtosFiltrados.length >= 4 && (
                <div>
                  <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-8 rounded-sm bg-linear-to-t from-taupe-800 to-transparent" />
                  <ChevronDown className="text-muted-foreground absolute right-1/2 bottom-0 size-4" />
                </div>
              )}
            </div>
          </ToggleGroup>
          <FieldDescription>
            <span className="mt-0 flex items-center gap-2 text-xs">
              <span className="bg-muted rounded-sm p-1 font-mono">
                {produtosFiltrados.length}
              </span>
              produto(s) encontrado(s).
            </span>
          </FieldDescription>
        </Field>
      </div>
    </div>
  );
}
