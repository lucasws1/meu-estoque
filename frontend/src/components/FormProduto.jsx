import { Minus, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function FormProduto({ valores, onChange, erro }) {
  return (
    <div className="mt-2 flex flex-col gap-4">
      {erro && (
        <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border px-3 py-2 text-sm">
          {erro}
        </p>
      )}

      <div className="border-b pb-6">
        <p className="mb-2 text-xs">Nome do produto</p>
        <Input
          id="nome"
          placeholder="Ex.: Camiseta Polo M"
          value={valores.nome}
          onChange={(e) => onChange("nome", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 border-b pt-1 pb-6">
        <p className="text-xs">Preços</p>
        <div className="flex gap-4">
          <Label className="text-muted-foreground flex w-full flex-col items-start text-xs">
            Custo (R$)
            <Input
              id="preco_custo"
              placeholder="R$ 0,00"
              value={valores.preco_custo}
              onChange={(e) => onChange("preco_custo", e.target.value)}
              className="text-white"
            />
          </Label>
          <Label className="text-muted-foreground flex w-full flex-col items-start text-xs">
            Venda (R$)
            <Input
              id="preco_venda"
              placeholder="R$ 0,00"
              value={valores.preco_venda}
              onChange={(e) => onChange("preco_venda", e.target.value)}
              className="text-white"
            />
          </Label>
        </div>
        <div>
          <div className="flex w-full items-center rounded-md bg-[#332E2D] p-2 text-sm">
            <span className="text-muted-foreground w-full text-xs">
              Margem de lucro
            </span>
            {valores.preco_custo && valores.preco_venda ? (
              <div className="flex w-full justify-end">
                {(
                  ((parseFloat(valores.preco_venda) -
                    parseFloat(valores.preco_custo)) /
                    parseFloat(valores.preco_custo)) *
                  100
                ).toFixed(2)}
                %
              </div>
            ) : (
              <p>0%</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <p className="text-xs">Quantidade inicial em estoque</p>
          <p className="text-muted-foreground text-xs">
            Quantas unidades você tem disponíveis agora?
          </p>
        </div>
        <div className="flex w-full items-center justify-center gap-4">
          <Minus
            className="border-border h-auto w-full max-w-10 cursor-pointer rounded-full border bg-[#332E2D] p-2"
            onClick={() =>
              onChange(
                "quantidade_estoque",
                Math.max(0, parseInt(valores.quantidade_estoque) - 1),
              )
            }
          />
          <p className="border-border flex w-full justify-center rounded-md border bg-[#332E2D] px-2 py-1 text-xl font-medium">
            {valores.quantidade_estoque} un.
          </p>
          <Plus
            className="border-border h-auto w-full max-w-10 cursor-pointer rounded-full border bg-[#332E2D] p-2"
            onClick={() =>
              onChange(
                "quantidade_estoque",
                parseInt(valores.quantidade_estoque) + 1,
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
