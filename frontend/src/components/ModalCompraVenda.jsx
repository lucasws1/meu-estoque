import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import FormEntrada from "./FormEntrada";
import FormSaida from "./FormSaida";
import { Button } from "./ui/button";

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
    setValores({
      produto_id: produto?.id,
      data_movimentacao: new Date().toISOString().split("T")[0],
      tipo: tabAtual === "saida" ? "saida" : "entrada",
      quantidade: "",
      preco_unitario:
        tabAtual === "saida"
          ? (produto?.preco_venda ?? "")
          : produto?.preco_custo,
      observacao: "",
    });
  }, [produto, tabAtual]);

  const handleChange = (campo, valor) => {
    setValores((v) => ({ ...v, [campo]: valor }));
  };

  const handleSalvar = async () => {
    if (!valores.quantidade.trim()) {
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
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent>
        <Tabs
          defaultValue="saida"
          value={tabAtual}
          onValueChange={setTabAtual}
          className="w-full"
        >
          <TabsList>
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
          <DialogFooter className="mt-5">
            <Button onClick={handleSalvar}>Confirmar</Button>
            <Button variant="outline" onClick={onFechar}>
              Cancelar
            </Button>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
