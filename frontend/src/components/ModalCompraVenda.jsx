import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import FormEntrada from "./FormEntrada";
import FormSaida from "./FormSaida";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const CAMPO_VAZIO = {
  produto_id: "",
  data_movimentacao: "",
  tipo: "",
  quantidade: "",
  preco_unitario: "",
  observacao: "",
};

export default function ModalCompraVenda({
  aberto,
  onFechar,
  onSalvar,
  produto,
}) {
  const [valores, setValores] = useState(CAMPO_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [tabAtual, setTabAtual] = useState("saida");

  useEffect(() => {
    const valoresIniciais = {
      produto_id: produto?.id,
      data_movimentacao: new Date().toISOString().split("T")[0],
      tipo: tabAtual === "entrada" ? "entrada" : "saida",
      quantidade: 1,
      preco_unitario:
        tabAtual === "entrada" ? produto?.preco_custo : produto?.preco_venda,
      observacao: "",
    };

    setValores(valoresIniciais);
  }, [produto, tabAtual]);

  const handleChange = (campo, valor) => {
    setValores((v) => ({ ...v, [campo]: valor }));
  };

  const handleSalvar = async () => {
    if (!valores.quantidade) {
      setErro('O campo "quantidade" é obrigatório.');
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      await onSalvar(valores);
      onFechar();
    } catch (error) {
      setErro(error.response?.data?.error ?? "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  if (!aberto) return;
  return (
    <Dialog className="w-full" open={aberto} onOpenChange={onFechar}>
      <DialogContent className="w-full">
        <Tabs defaultValue="saida" value={tabAtual} onValueChange={setTabAtual}>
          <TabsList variant="line" className="mb-2 w-full">
            <TabsTrigger value="saida">Vender</TabsTrigger>
            <TabsTrigger value="entrada">Comprar</TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="saida">
            <FormSaida
              valores={valores}
              produto={produto}
              handleChange={handleChange}
            />
          </TabsContent>
          <TabsContent value="entrada">
            <FormEntrada
              valores={valores}
              produto={produto}
              handleChange={handleChange}
            />
          </TabsContent>
          <DialogFooter className="mt-5 grid grid-cols-2">
            <Button
              className="bg-green-700 text-white hover:bg-green-500"
              onClick={handleSalvar}
              disabled={salvando}
            >
              {salvando && <Loader2 className="animate-spin" />}
              {salvando ? "Salvando..." : "OK"}
            </Button>
            <Button variant="outline" onClick={onFechar}>
              Cancelar
            </Button>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
