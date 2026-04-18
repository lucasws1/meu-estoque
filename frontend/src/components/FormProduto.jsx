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
        // aria-invalid={id === "nome" && !!erro}
      />
    </div>
  );

  return (
    <div>
      <h1>Produto</h1>
    </div>
  );
}
