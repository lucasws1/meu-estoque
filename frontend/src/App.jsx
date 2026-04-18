import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Produtos from "./pages/Produtos";
import Movimentacoes from "./pages/Movimentacoes";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/movimentacoes" element={<Movimentacoes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
