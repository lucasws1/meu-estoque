import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";

export default function Navbar() {
  const { tema, alternarTema } = useTheme();

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between">
      <span className="font-bold text-lg">Meu Estoque</span>
      <nav className="flex gap-4">
        <Link to="/produtos">Produtos</Link>
        <Link to="/movimentacoes">Movimentações</Link>
        <Button onClick={() => {}}>Sair</Button>
        <Button variant="ghost" size="sm" onClick={alternarTema}>
          {tema === "dark" ? "☀️ Claro" : "🌙 Escuro"}
        </Button>
      </nav>
    </header>
  );
}
