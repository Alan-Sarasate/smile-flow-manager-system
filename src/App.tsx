
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Finance from "./pages/Finance";
import Inventory from "./pages/Inventory";
import ClientBooking from "./pages/ClientBooking";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Auth from "./pages/Auth";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient();

const App = () => {
  const { initialize, initialized, user } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!initialized) return <div>Carregando...</div>;
    
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/booking" element={<ClientBooking />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Dashboard Routes */}
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/inventory" element={<Inventory />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
