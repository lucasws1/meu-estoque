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
    <div className="flex flex-col gap-4">
      {erro && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          {erro}
        </p>
      )}
      {campo("nome", "Nome *", "Nome do produto")}
      {campo("preco_custo", "Preço de Custo *", "Preço de custo do produto")}
      {campo("preco_venda", "Preço de Venda *", "Preço de venda do produto")}
      {campo(
        "quantidade_estoque",
        "Quantidade em Estoque",
        "Quantidade em estoque do produto",
      )}
    </div>
  );
}
