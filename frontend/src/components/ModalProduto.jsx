import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import FormProduto from "./FormProduto";
import { Button } from "./ui/button";

const CAMPO_VAZIO = {
  nome: "",
  preco_custo: "",
  preco_venda: "",
  quantidade_estoque: "",
};

export default function ModalProduto({
  aberto,
  onFechar,
  modoEdicao,
  onSalvar,
}) {
  const [valores, setValores] = useState(modoEdicao ?? CAMPO_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (campo, valor) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (campo === "nome" || campo === "preco_custo" || campo === "preco_venda")
      setErro("");
  };

  const handleSalvar = async () => {
    if (!valores.nome.trim()) {
      setErro('O campo "nome" é obrigatório.');
      return;
    }
    if (!valores.preco_custo.trim()) {
      setErro('O campo "preco_custo" é obrigatório.');
      return;
    }
    if (!valores.preco_venda.trim()) {
      setErro('O campo "preco_venda" é obrigatório.');
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      await onSalvar(valores);
      onFechar();
    } catch (error) {
      setErro(error.response?.data?.error ?? "Erro ao salvar produto.");
    } finally {
      setSalvando(false);
    }
  };

  if (!aberto) return null;
  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {modoEdicao ? "Editar produto" : "Novo produto"}
          </DialogTitle>
          {modoEdicao ? (
            <DialogDescription>{modoEdicao.nome}</DialogDescription>
          ) : (
            ""
          )}
        </DialogHeader>
        <FormProduto valores={valores} onChange={handleChange} erro={erro} />
        <DialogFooter>
          <Button variant="outline" onClick={onFechar} disabled={salvando}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={salvando}>
            {salvando && <Loader2 className="animate-spin" />}
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
