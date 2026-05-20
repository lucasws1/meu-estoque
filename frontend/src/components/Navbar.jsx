import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowLeftRight,
  Box,
  ClipboardList,
  House,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"; // lucide-react já vem com o shadcn
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

export default function Navbar() {
  const { logout } = useAuth();
  const { tema, alternarTema } = useTheme();

  const linkStyles = ({ isActive }) =>
    `flex items-center w-full gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium focus:outline-none ${
      isActive
        ? "text-bold-foreground bg-primary/10 border"
        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
    }`;

  return (
    <header className="border-border bg-background/15 sticky top-3 z-50 mx-auto mb-15 w-[90%] rounded-xl border backdrop-blur xl:w-full xl:max-w-7xl">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        {/* Lado Esquerdo: Logo */}
        <div className="hidden items-center md:flex md:flex-1">
          <span className="from-primary to-primary/60 flex items-center gap-3 bg-linear-to-r bg-clip-text text-xl font-bold tracking-tight text-transparent">
            <ClipboardList className="text-primary/80 h-auto w-4" />
            <span className="hidden sm:inline-block">Meu Estoque</span>
          </span>
        </div>

        {/* Centro: Navegação */}
        <nav className="flex gap-4">
          <NavLink to="/" className={linkStyles}>
            <House className="h-4 w-4" />
            <span className="hidden sm:inline-block">Início</span>
          </NavLink>
          <NavLink to="/produtos" className={linkStyles}>
            <Box className="h-4 w-4" />
            <span className="hidden sm:inline-block">Produtos</span>
          </NavLink>

          <NavLink to="/movimentacoes" className={linkStyles}>
            <ArrowLeftRight className="h-4 w-4" />
            <span className="hidden sm:inline-block">Movimentações</span>
          </NavLink>
        </nav>

        {/* Lado Direito: Ações do Usuário */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={alternarTema}
            title="Alternar tema"
            className="text-muted-foreground"
          >
            {tema === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-border/50 gap-2"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden cursor-pointer sm:inline-block">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
