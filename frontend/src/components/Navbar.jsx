import { Link, NavLink } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";
import {
  Package2,
  ArrowLeftRight,
  LogOut,
  Sun,
  Moon,
  Box,
  ClipboardList,
  House,
} from "lucide-react"; // lucide-react já vem com o shadcn

export default function Navbar() {
  const { tema, alternarTema } = useTheme();

  const linkStyles = ({ isActive }) =>
    `flex items-center w-full gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium focus:outline-none ${
      isActive
        ? "text-bold-foreground bg-primary/10 border"
        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
    }`;

  return (
    <header className="sticky mb-20 top-3 z-50 mx-auto md:max-w-7xl w-fit md:w-full border border-border rounded-xl bg-background/15 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        {/* Lado Esquerdo: Logo */}
        <div className=" items-center hidden md:flex-1 md:flex">
          <span className="flex items-center gap-3 text-xl text-transparent bg-linear-to-r from-primary to-primary/60 bg-clip-text tracking-tight font-bold">
            <ClipboardList className="w-4 h-auto text-primary/80" />
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
        <div className="flex-1 flex items-center justify-end gap-3">
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
            className="gap-2 border-border/50"
            onClick={() => {}}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline-block cursor-pointer">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
