import { useAuth } from "@/context/AuthContext";
import { fazerLogin } from "@/services/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Moon, Package, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { tema, alternarTema } = useTheme();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const { data } = await fazerLogin({ email, senha });
      login(data.token, data.usuario);
      navigate("/", { replace: true });
    } catch (error) {
      setErro(
        error.response?.data?.error ||
          "Erro ao fazer login. Por favor, tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Package className="size-6" />
            <span className="text-xl font-semibold tracking-tight">
              Meu Estoque
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Gestão de estoque simplificada para pequenos negócios
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entrar</CardTitle>
            <CardDescription>
              Use seu e-mail e senha para acessar o sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={carregando}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={carregando}
                />
              </div>

              {erro && <p className="text-sm text-destructive">{erro}</p>}

              <Button type="submit" className="w-full" disabled={carregando}>
                {carregando && <Loader2 className="size-4 animate-spin" />}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={alternarTema}
        title="Alternar tema"
        className="mt-10"
      >
        {tema === "dark" ? (
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5" /> Tema claro
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5" /> Tema escuro
          </div>
        )}
      </Button>
    </div>
  );
}
