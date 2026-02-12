import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ItemsPage from "./pages/ItemsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/items" element={<ItemsPage />} />
    </Routes>
  );
}
