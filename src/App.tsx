import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HorseSearch from "./pages/HorseSearch";
import LiveEvents from "./pages/LiveEvents";
import NotFound from "./pages/NotFound";

console.log('App.tsx: Component loading...');

const queryClient = new QueryClient();

const App = () => {
  console.log('App.tsx: App component rendering...');
  
  // Set basename for GitHub Pages deployment
  const basename = import.meta.env.PROD ? '/stable-star-tracker' : '';
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<HorseSearch />} />
            <Route path="/breeding" element={<LiveEvents />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

console.log('App.tsx: App component defined');

export default App;