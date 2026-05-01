import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { CheckIcon, Loader2, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import FormMovimentacoes from "./FormMovimentacoes";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper";

const TIPOS = ["entrada", "saida"];

const CAMPO_VAZIO = {
  produto_id: "",
  tipo: "",
  quantidade: "",
  preco_unitario: "",
  data_movimentacao: "",
  observacao: "",
};

const steps = [
  { title: "Produto" },
  { title: "Tipo" },
  { title: "Quantidade" },
];

export default function ModalMovimentacoes({
  aberto,
  onFechar,
  modoEdicao,
  onSalvar,
  produtos,
}) {
  const [valores, setValores] = useState(() => {
    if (!modoEdicao) return CAMPO_VAZIO;
    return {
      ...modoEdicao,
      data_movimentacao: modoEdicao.data_movimentacao
        ? format(new Date(modoEdicao.data_movimentacao), "yyyy-MM-dd")
        : "",
    };
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

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
      <DialogContent className="flex w-full flex-col">
        <DialogHeader className="mb-4 gap-0">
          <DialogDescription className="text-muted-foreground mb-0 text-xs font-normal">
            {modoEdicao ? "EDITAR MOVIMENTAÇÃO" : "NOVA MOVIMENTAÇÃO"}
          </DialogDescription>

          {modoEdicao && currentStep === 1 ? (
            <DialogTitle className="text-lg">
              {produtos.find((p) => p.id === modoEdicao.produto_id)?.nome}
            </DialogTitle>
          ) : (
            currentStep === 1 && (
              <DialogTitle className="text-lg">Selecione o produto</DialogTitle>
            )
          )}
        </DialogHeader>
        <Stepper
          value={currentStep}
          onValueChange={setCurrentStep}
          className="w-full space-y-6"
          defaultValue={1}
          indicators={{
            completed: <CheckIcon className="size-3.5" />,
            loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
          }}
        >
          <StepperNav>
            {steps.map((step, index) => (
              <StepperItem
                key={index}
                step={index + 1}
                className="relative flex-1 items-start"
              >
                <StepperTrigger className="flex flex-col gap-2.5">
                  <StepperIndicator>{index + 1}</StepperIndicator>
                  <StepperTitle>{step.title}</StepperTitle>
                </StepperTrigger>
                {steps.length > index + 1 && (
                  <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-3 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                )}
              </StepperItem>
            ))}
          </StepperNav>
          <StepperPanel className="w-full text-sm">
            <StepperContent
              key={1}
              value={1}
              className="flex w-full items-center justify-start"
            >
              <FormMovimentacoes
                valores={valores}
                onChange={handleChange}
                erro={erro}
                produtos={produtos}
              />
            </StepperContent>
            {/* {steps.map((step, index) => (
              <StepperContent
                key={index}
                value={index + 1}
                className="flex items-center justify-center"
              >
                Step {step.title} content
              </StepperContent>
            ))} */}
          </StepperPanel>
        </Stepper>

        <DialogFooter className="grid grid-cols-2 justify-end gap-2">
          <Button
            onClick={handleSalvar}
            disabled={salvando}
            className="w-full bg-green-600 text-white"
          >
            {salvando && <Loader2 className="animate-spin" />}
            {salvando ? "Salvando" : "Salvar"}
          </Button>
          <Button
            variant="outline"
            onClick={onFechar}
            disabled={salvando}
            className="w-full"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
