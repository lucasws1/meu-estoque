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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/produtos" />} />
        <Route path="/produtos" element={<Produtos />} />
        {/* <Route path="/movimentacoes" element={<div>Movimentações</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
