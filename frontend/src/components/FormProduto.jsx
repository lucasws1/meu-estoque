import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function FormProduto({ valores, onChange, erro }) {
  const campo = (id, label, placeholder, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={valores[id]}
        onChange={(e) => onChange(id, e.target.value)}
        aria-invalid={id === "nome" && !!erro}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4 mt-4">
      {erro && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          {erro}
        </p>
      )}

      <div className="border-b pb-6">
        <p className="text-xs mb-2">Nome do produto</p>
        <Input
          id="nome"
          placeholder="Ex.: Camiseta Polo M"
          value={valores.nome}
          onChange={(e) => onChange("nome", e.target.value)}
        />
      </div>

      <div className="border-b pt-1 pb-6 flex flex-col gap-4">
        <p className="text-xs">Preços</p>
        <div className="flex gap-4">
          <Label className="flex flex-col items-start text-xs text-muted-foreground w-full">
            Custo (R$)
            <Input
              id="preco_custo"
              placeholder="R$ 0,00"
              value={valores.preco_custo}
              onChange={(e) => onChange("preco_custo", e.target.value)}
            />
          </Label>
          <Label className="flex flex-col items-start text-xs text-muted-foreground w-full">
            Venda (R$)
            <Input
              id="preco_venda"
              placeholder="R$ 0,00"
              value={valores.preco_venda}
              onChange={(e) => onChange("preco_venda", e.target.value)}
            />
          </Label>
        </div>
        <div>
          <div className="text-sm border-border border bg-muted p-2 flex items-center rounded-md w-full">
            <span className="text-xs text-muted-foreground w-full">
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

      {campo(
        "quantidade_estoque",
        "Quantidade em Estoque",
        "Quantidade em estoque do produto",
      )}
    </div>
  );
}
