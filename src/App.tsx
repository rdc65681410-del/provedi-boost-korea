import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AppLayout from "./pages/App";
import Dashboard from "./pages/app/Dashboard";
import Analyze from "./pages/app/Analyze";
import ContentGenerate from "./pages/app/ContentGenerate";
import Channels from "./pages/app/Channels";
import Rankings from "./pages/app/Rankings";
import Timing from "./pages/app/Timing";
import Packages from "./pages/app/Packages";
import Reports from "./pages/app/Reports";
import Campaigns from "./pages/app/Campaigns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="generate" element={<ContentGenerate />} />
            <Route path="channels" element={<Channels />} />
            <Route path="rankings" element={<Rankings />} />
            <Route path="content" element={<Dashboard />} />
            <Route path="timing" element={<Timing />} />
            <Route path="packages" element={<Packages />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Dashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
