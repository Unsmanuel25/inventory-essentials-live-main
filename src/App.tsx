
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Inventario } from "./pages/Inventario";
import { CreazioneProdotto } from "./pages/CreazioneProdotto";
import { CercaProdotto } from "./pages/CercaProdotto";
import { DistintaBase } from "./pages/DistintaBase";
import { CaricoScarico } from "./pages/CaricoScarico";
import { MerceInArrivo } from "./pages/MerceInArrivo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="crea-prodotto" element={<CreazioneProdotto />} />
            <Route path="cerca-prodotto" element={<CercaProdotto />} />
            <Route path="distinta-base" element={<DistintaBase />} />
            <Route path="carico-scarico" element={<CaricoScarico />} />
            <Route path="merce-in-arrivo" element={<MerceInArrivo />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
