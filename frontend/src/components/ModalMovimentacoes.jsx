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
import { Button } from "./ui/button";
import FormMovimentacoes from "./FormMovimentacoes";

const TIPOS = ["entrada", "saida"];

const CAMPO_VAZIO = {
  produto_id: "",
  tipo: "",
  quantidade: "",
  preco_unitario: "",
  data_movimentacao: "",
  observacao: "",
};

export default function ModalMovimentacoes({
  aberto,
  onFechar,
  modoEdicao,
  onSalvar,
  produtos,
}) {
  const [valores, setValores] = useState(modoEdicao ?? CAMPO_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (campo, valor) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (
      campo === "produto_id" ||
      campo === "tipo" ||
      campo === "quantidade" ||
      campo === "preco_unitario"
    ) {
      setErro("");
    }
  };

  const handleSalvar = async () => {
    if (!valores.produto_id) {
      setErro('O campo "produto_id" é obrigatório.');
      return;
    }
    if (!valores.tipo.trim()) {
      setErro('O campo "tipo" é obrigatório.');
      return;
    }
    if (!valores.quantidade) {
      setErro('O campo "quantidade" é obrigatório.');
      return;
    }
    if (!valores.preco_unitario) {
      setErro('O campo "preco_unitario" é obrigatório.');
      return;
    }

    setSalvando(true);
    setErro("");
    try {
      await onSalvar(valores);
      onFechar();
    } catch (error) {
      setErro(error?.response?.data?.error ?? "Erro ao salvar movimentação.");
    } finally {
      setSalvando(false);
    }
  };

  if (!aberto) return null;
  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-lg w-70">
        <DialogHeader>
          <DialogTitle>
            {modoEdicao ? "Editar movimentação" : "Nova movimentação"}
          </DialogTitle>
          {modoEdicao ? (
            <DialogDescription>
              {produtos.find((p) => p.id === modoEdicao.produto_id)?.nome}
            </DialogDescription>
          ) : (
            <DialogDescription>
              Preencha os dados da movimentação
            </DialogDescription>
          )}
        </DialogHeader>
        <FormMovimentacoes
          valores={valores}
          onChange={handleChange}
          erro={erro}
          produtos={produtos}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onFechar} disabled={salvando}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={salvando}>
            {salvando && <Loader2 className="animate-spin" />}
            {salvando ? "Salvando" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
