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
import StepProduto from "./StepProduto";
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
import StepTipo from "./StepTipo";
import StepQuantidade from "./StepQuantidade";

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
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [valores, setValores] = useState(() => {
    if (!modoEdicao) return CAMPO_VAZIO;
    return {
      ...modoEdicao,
      data_movimentacao: modoEdicao.data_movimentacao
        ? format(new Date(modoEdicao.data_movimentacao), "yyyy-MM-dd")
        : "",
    };
  });

  const handleVoltar = (goToStep = null) => {
    if (goToStep && goToStep < currentStep) {
      setCurrentStep(goToStep);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onFechar();
      setValores(CAMPO_VAZIO);
    }
  };

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
      setErro("O campo produto é obrigatório.");
      return;
    }
    if (!valores.tipo) {
      setErro("O campo tipo é obrigatório.");
      return;
    }
    if (!valores.quantidade) {
      setErro("O campo quantidade é obrigatório.");
      return;
    }
    if (!valores.preco_unitario) {
      setErro("O campo preço unitário é obrigatório.");
      return;
    }

    setSalvando(true);
    setErro("");
    try {
      await onSalvar(valores);
      onFechar();
      setValores(CAMPO_VAZIO);
    } catch (error) {
      setErro(error?.response?.data?.error ?? "Erro ao salvar movimentação.");
    } finally {
      setSalvando(false);
    }
  };

  if (!aberto) return null;
  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="flex flex-col">
        <DialogHeader className="mb-4 gap-0">
          <DialogDescription className="text-muted-foreground mb-0 text-xs font-normal">
            {modoEdicao ? "EDITAR MOVIMENTAÇÃO" : "NOVA MOVIMENTAÇÃO"}
          </DialogDescription>

          {modoEdicao && currentStep === 1 ? (
            <DialogTitle className="text-lg">
              {produtos.find((p) => p.id === modoEdicao.produto_id)?.nome}
            </DialogTitle>
          ) : currentStep === 1 ? (
            <DialogTitle className="text-lg">Selecione o produto</DialogTitle>
          ) : currentStep === 2 ? (
            <DialogTitle className="text-lg">
              Selecione o tipo de movimentação
            </DialogTitle>
          ) : (
            <DialogTitle className="text-lg">Defina a quantidade</DialogTitle>
          )}
        </DialogHeader>
        <Stepper
          value={currentStep}
          onValueChange={setCurrentStep}
          className="w-full"
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
          <StepperPanel className="text-sm">
            <StepperContent
              key={1}
              value={1}
              className="flex w-full items-center"
            >
              <div className="flex flex-col">
                <StepProduto
                  valores={valores}
                  onChange={handleChange}
                  erro={erro}
                  produtos={produtos}
                />
              </div>
            </StepperContent>
            <StepperContent
              key={2}
              value={2}
              className="flex w-full items-center"
            >
              <div className="flex">
                <StepTipo
                  valores={valores}
                  onChange={handleChange}
                  erro={erro}
                  produtos={produtos}
                  handleVoltar={handleVoltar}
                />
              </div>
            </StepperContent>
            <StepperContent
              key={3}
              value={3}
              className="flex w-full items-center"
            >
              <div className="flex">
                <StepQuantidade
                  valores={valores}
                  onChange={handleChange}
                  erro={erro}
                  produtos={produtos}
                  handleVoltar={handleVoltar}
                />
              </div>
            </StepperContent>
          </StepperPanel>
        </Stepper>
        <DialogFooter className="mt-2 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleVoltar}
            disabled={salvando}
            className="w-full flex-1 py-4"
          >
            {currentStep > 1 ? "Voltar" : "Cancelar"}
          </Button>
          <Button
            onClick={
              currentStep < 3
                ? () => setCurrentStep(currentStep + 1)
                : handleSalvar
            }
            disabled={
              (currentStep === 1 && !valores.produto_id) ||
              (currentStep === 2 && !valores.tipo) ||
              (currentStep === 3 && !valores.quantidade) ||
              salvando
            }
            className="w-full flex-1 bg-green-600 py-4 text-white"
          >
            {currentStep === 3 ? (
              <>
                {salvando && <Loader2 className="animate-spin" />}
                {salvando ? "Salvando..." : "Salvar"}
              </>
            ) : (
              <>{valores.produto_id ? "Avançar" : "Selecionar Produto"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
