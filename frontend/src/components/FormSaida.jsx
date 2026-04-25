import { DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function FormSaida({ valores, produto, handleChange }) {
  return (
    <div className="w-full flex flex-col">
      <DialogHeader className="flex flex-col mb-4">
        <DialogTitle>
          Vender{" "}
          <span className="font-bold text-green-300">{produto.nome}</span>
        </DialogTitle>
      </DialogHeader>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Data da movimentação:</Label>
          <Input
            disabled
            value={new Date(valores.data_movimentacao)?.toLocaleDateString(
              "pt-BR",
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Preço unitário:</Label>
          <Input value={valores.preco_unitario || "—"} disabled />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground" htmlFor="quantidade_estoque">
            Estoque:
          </Label>
          <Input
            id="quantidade_estoque"
            value={produto.quantidade_estoque || "—"}
            disabled
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="quantidade">Quantidade:</Label>
          <Input
            id="quantidade"
            type="number"
            onChange={(e) => handleChange("quantidade", e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="observacao">Observações:</Label>
          <Textarea
            id="observacao"
            className="w-full"
            onChange={(e) => handleChange("observacao", e.target.value)}
          />
        </div>
        <div className="w-full flex text-md font-medium justify-end">
          Total:{" "}
          {valores.quantidade && valores.preco_unitario
            ? (valores.quantidade * valores.preco_unitario).toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                },
              )
            : "—"}
        </div>
      </div>
    </div>
  );
}
