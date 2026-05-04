import { Field, FieldLabel } from "./ui/field";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

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

export default function StepTipo({
  valores,
  onChange,
  erro,
  produtos,
  handleVoltar,
}) {
  const [tipoSelecionado, setTipoSelecionado] = useState(valores.tipo || "");
  const produtoSelecionado = produtos.find((p) => p.id === valores.produto_id);

  return (
    <div className="mt-6 flex flex-col">
      {erro && (
        <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border px-3 py-2 text-sm">
          {erro}
        </p>
      )}
      <Field>
        <div className="bg-muted relative flex h-auto max-w-96 min-w-86 flex-col items-start justify-center rounded-lg p-3">
          <span className="w-full">{produtoSelecionado?.nome}</span>
          <span className="text-muted-foreground w-full text-xs">
            Estoque: {produtoSelecionado?.quantidade_estoque} un.·{" "}
            {Number(produtoSelecionado?.preco_venda).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          <span
            className="text-muted-foreground absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer text-xs"
            onClick={handleVoltar}
          >
            Trocar
          </span>
        </div>
        <FieldLabel className="mt-4">Qual o tipo da movimentação?</FieldLabel>
        <ToggleGroup
          type="single"
          value={tipoSelecionado}
          onValueChange={(value) => {
            setTipoSelecionado(value);
            onChange("tipo", value);
          }}
          variant="outline"
          spacing={2}
        >
          <div className="mt-2 flex w-full gap-4">
            {TIPOS.map((tipo) => (
              <ToggleGroupItem
                key={tipo.value}
                value={tipo.value}
                className="flex size-28 w-full flex-1 flex-col items-center justify-center gap-2"
              >
                <span className="text-3xl">{tipo.icon}</span>
                <span className="text-md">{tipo.label}</span>
                <span className="text-muted-foreground text-xs">
                  {tipo.desc}
                </span>
              </ToggleGroupItem>
            ))}
          </div>
        </ToggleGroup>
      </Field>
    </div>
  );
}
