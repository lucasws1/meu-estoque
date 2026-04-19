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

const TIPOS = ["entrada", "saida"];

export default function FormMovimentacoes({
  valores,
  onChange,
  erro,
  produtos,
}) {
  return (
    <div className="flex flex-col gap-4 items-start">
      {erro && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          {erro}
        </p>
      )}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="produto_id" className="w-fit">
            Produto
          </Label>
          <Select
            value={valores.produto_id || ""}
            onValueChange={(v) => onChange("produto_id", v)}
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Produto" />
            </SelectTrigger>
            <SelectContent>
              {produtos.map((produto) => (
                <SelectItem key={produto.id} value={produto.id}>
                  {produto.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            value={valores.tipo || ""}
            onValueChange={(v) => onChange("tipo", v)}
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quantidade">Quantidade *</Label>
          <Input
            className="w-50"
            id="quantidade"
            type="number"
            placeholder="Quantidade"
            value={valores.quantidade || ""}
            onChange={(e) => onChange("quantidade", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="preco_unitario">Preço unitário *</Label>
          <Input
            className="w-50"
            id="preco_unitario"
            type="number"
            placeholder="Preço unitário"
            value={valores.preco_unitario || ""}
            onChange={(e) => onChange("preco_unitario", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="data">Data</Label>
          <Input
            className="w-50"
            id="data"
            type="date"
            placeholder="Data"
            value={valores.data_movimentacao || ""}
            onChange={(e) => onChange("data_movimentacao", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="observacao">Observação</Label>
          <Input
            className="w-50"
            id="observacao"
            type="text"
            placeholder="Observação"
            value={valores.observacao || ""}
            onChange={(e) => onChange("observacao", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
