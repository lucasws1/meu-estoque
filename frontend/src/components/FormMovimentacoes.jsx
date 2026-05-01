import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ChevronRightIcon, Search } from "lucide-react";

const TIPOS = ["entrada", "saida"];

export default function FormMovimentacoes({
  valores,
  onChange,
  erro,
  produtos,
}) {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [busca, setBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState(produtos);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const searchResult = produtos.filter((produto) =>
        String(produto.nome)
          .toLowerCase()
          .includes(String(busca).toLowerCase()),
      );
      if (searchResult.length === 0) {
        setProdutosFiltrados(produtos);
      } else {
        setProdutosFiltrados(searchResult);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [busca, produtos]);

  return (
    <div className="flex flex-col gap-4">
      {erro && (
        <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border px-3 py-2 text-sm">
          {erro}
        </p>
      )}
      <div className="mt-4 flex flex-col">
        <Field>
          <FieldLabel>Qual produto?</FieldLabel>
          <ToggleGroup
            type="single"
            value={produtoSelecionado || ""}
            onValueChange={(value) => setProdutoSelecionado(value)}
            variant="outline"
            spacing={2}
          >
            <div className="flex h-70 w-80 flex-col gap-2 overflow-y-hidden md:w-86">
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
          </ToggleGroup>
          <FieldDescription>
            <div className="mt-2">
              Foram localizados{" "}
              <code className="bg-muted rounded-md px-1 py-0.5 font-mono">
                {produtosFiltrados.length}
              </code>{" "}
              produtos.
            </div>
          </FieldDescription>
          <div className="relative mt-4 w-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="size-10 w-full pl-8"
              placeholder="Buscar produto..."
            />
          </div>
        </Field>
      </div>
    </div>
  );
}
