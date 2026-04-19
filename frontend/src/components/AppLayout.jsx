import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex">
        <Outlet />
      </main>
    </div>
  );
}
