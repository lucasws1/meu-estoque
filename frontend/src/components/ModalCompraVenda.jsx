import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
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
            <DialogHeader className="flex flex-col mt-2">
              <DialogTitle>
                <span className="font-bold text-green-300">{produto.nome}</span>
              </DialogTitle>
              <DialogDescription>
                Data: {new Date().toLocaleDateString("pt-BR")}
              </DialogDescription>
            </DialogHeader>
            <div className="w-full flex flex-col">
              <div className="w-full flex flex-col gap-6">
                <Input id="produto_id" type="hidden" value={produto.id} />
                <Input id="tipo" type="hidden" value="saida" />
                <div className="flex flex-col gap-1 my-4 border border-gray-400 rounded-xl py-2 px-4 w-fit text-white text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Dados do produto:
                    </span>
                  </div>
                  <div>
                    Preço unitário:{" "}
                    <Badge variant="outline">
                      {Number(produto.preco_venda ?? 0)?.toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        },
                      )}
                    </Badge>
                  </div>
                  <div>
                    Estoque:{" "}
                    <Badge variant="outline">
                      {produto.quantidade_estoque || "—"}
                    </Badge>
                  </div>
                </div>
                <div className="w-full gap-2 flex">
                  <Label htmlFor="quantidade">Quantidade:</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    onChange={(e) => handleChange("quantidade", e.target.value)}
                  />
                </div>

                <div className="w-full flex flex-col gap-2">
                  Observações:
                  <Textarea className="w-full" />
                </div>
                <div className="w-full flex text-md font-medium justify-end">
                  Total:{" "}
                  {valores.quantidade && valores.preco_unitario
                    ? (
                        valores.quantidade * valores.preco_unitario
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "—"}
                </div>
              </div>
              <DialogFooter className="mt-5">
                <Button onClick={handleSalvar}>Confirmar</Button>
                <Button variant="outline">Cancelar</Button>
              </DialogFooter>
            </div>
          </TabsContent>
          <TabsContent value="entrada">Change your password here.</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
