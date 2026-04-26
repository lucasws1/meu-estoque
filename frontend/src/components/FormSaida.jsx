import { Minus, Plus } from "lucide-react";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function FormSaida({ valores, produto, handleChange }) {
  return (
    <div className="w-full flex flex-col">
      <DialogHeader className="flex flex-col gap-0 mb-4">
        <DialogDescription>PRODUTO</DialogDescription>
        <DialogTitle className="text-xl">{produto.nome}</DialogTitle>
      </DialogHeader>
      <div className="flex w-full items-start flex-col gap-4">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 w-full py-2 rounded-md justify-center">
          <div className="flex flex-col w-full bg-border p-3 rounded-md">
            <p className="text-muted-foreground text-xs">Preço unit.</p>
            <p className="text-sm font-medium">
              R$ {valores.preco_unitario?.toLocaleString("pt-BR") || "—"}
            </p>
          </div>

          <div className="flex flex-col bg-border p-3 w-full rounded-md">
            <p className="text-muted-foreground text-xs">Estoque:</p>
            <p className="text-sm font-medium">
              {produto.quantidade_estoque || "—"} un.
            </p>
          </div>
          <div className="flex flex-col w-full bg-border p-3 rounded-md">
            <p className="text-muted-foreground text-xs">Data</p>
            <p className="text-sm font-medium">
              {new Date(valores.data_movimentacao).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <p className="text-sm font-medium">Quantas unidades vender?</p>
          <div className="flex items-center justify-center gap-6 w-full">
            <Minus
              id="quantidade"
              onClick={() => handleChange("quantidade", valores.quantidade - 1)}
              className="w-10 h-auto border border-gray-500 rounded-full p-2 bg-border"
            />
            <p className="text-5xl font-medium">{valores.quantidade}</p>
            <Plus
              id="quantidade"
              onClick={() => handleChange("quantidade", valores.quantidade + 1)}
              className="w-10 h-auto border border-gray-500 rounded-full p-2 bg-border"
            />
          </div>
        </div>
        <div className="w-full mt-3 flex items-center justify-between bg-border rounded-md p-3">
          <p>Total da venda</p>
          <p className="font-bold text-lg">
            {valores.quantidade && valores.preco_unitario
              ? (valores.quantidade * valores.preco_unitario).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  },
                )
              : "—"}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="observacao">Observações:</Label>
          <Textarea
            id="observacao"
            className="w-full"
            onChange={(e) => handleChange("observacao", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
