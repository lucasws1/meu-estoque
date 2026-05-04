import { Minus, Plus } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const TIPOS = [
  {
    value: "saida",
    label: "Saída",
    icon: "📤",
    desc: "Venda ou retirada",
  },
  {
    value: "entrada",
    label: "Entrada",
    icon: "📥",
    desc: "Compra ou reposição",
  },
];

export default function StepQuantidade({
  valores,
  onChange,
  erro,
  produtos,
  handleVoltar,
}) {
  const produtoSelecionado = produtos.find((p) => p.id === valores.produto_id);
  return (
    <div className="mt-10 flex flex-col">
      {erro && (
        <p className="text-destructive bg-destructive/10 border-destructive/20 mb-6 rounded-md border px-3 py-2 text-sm">
          {erro}
        </p>
      )}
      <Field>
        <div className="bg-muted relative flex h-auto max-w-96 min-w-86 flex-col items-start justify-center rounded-lg px-4 py-3">
          <span className="w-full">{produtoSelecionado?.nome}</span>
          <div className="text-muted-foreground flex w-full items-center gap-1 text-xs">
            <span className="flex items-center">
              {valores.tipo === "entrada"
                ? TIPOS[1].icon + " " + TIPOS[1].label
                : TIPOS[0].icon + " " + TIPOS[0].label}
            </span>
            <span className="flex items-center">
              ∙ Estoque atual: {produtoSelecionado?.quantidade_estoque} un.
            </span>
          </div>
          <span
            className="text-muted-foreground absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer text-xs"
            onClick={() => handleVoltar(1)}
          >
            Trocar
          </span>
        </div>

        <FieldLabel className="mt-4 flex w-full justify-center">
          Quantas unidades {valores.tipo === "entrada" ? "comprar" : "vender"}?
        </FieldLabel>

        <div className="flex w-full items-center justify-center gap-4">
          <Minus
            className="bg-muted border-border size-10 rounded-full border"
            onClick={() =>
              onChange("quantidade", Math.max(0, valores.quantidade - 1))
            }
          />
          <span className="bg-muted border-border align-center size-10 w-full flex-1 items-center rounded-md border pt-1 text-center text-xl">
            {valores.quantidade || 0}
          </span>
          <Plus
            className="bg-muted border-border size-10 rounded-full border"
            onClick={() =>
              (valores.quantidade || 0) + 1 <=
                (produtoSelecionado?.quantidade_estoque || 0) &&
              onChange("quantidade", (valores.quantidade || 0) + 1)
            }
          />
        </div>

        <div className="bg-muted mt-8 flex w-full items-center justify-between rounded-lg px-4 py-3">
          <span className="text-muted-foreground text-sm">Total da venda:</span>
          <span className="text-lg font-medium">
            {(
              Number(valores.quantidade || 0) *
              Number(valores.preco_unitario || 0)
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <div className="relative mt-4 mb-4">
          <Input
            id="observacao"
            className="mt-1 py-4"
            placeholder="Observações (opcional)"
            value={valores.observacao}
            onChange={(e) => onChange("observacao", e.target.value)}
          />
        </div>
      </Field>
    </div>
  );
}
