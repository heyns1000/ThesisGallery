import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { PageRouter } from "@/components/layout/PageRouter";
import { ScrollBreathGlyphs, useScrollBreathGlyphs } from "@/components/animations/ScrollBreathGlyphs";
import { ThemeProvider } from "@/hooks/use-theme";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingFallback from "@/components/LoadingFallback";
import { AppContextProvider } from "@/context/AppContext";
import Landing from "@/pages/landing";

function AuthWrapper() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activePage, setActivePage] = useState("home");
  const { scrollPosition, isActive, intensity } = useScrollBreathGlyphs({ threshold: 50, intensity: 'medium' });

  if (isLoading) {
    return <LoadingFallback message="Initializing Fruitful Global Master Hub..." className="h-screen" />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Landing />
      </ErrorBoundary>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ScrollBreathGlyphs Overlay */}
      <ScrollBreathGlyphs 
        isActive={isActive} 
        intensity={intensity} 
        scrollPosition={scrollPosition} 
      />
      
      {/* Sidebar with activePage state */}
      <ErrorBoundary>
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
        />
      </ErrorBoundary>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative ml-0 md:ml-0">
        <ErrorBoundary>
          <PageRouter activePage={activePage} />
        </ErrorBoundary>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fruitful-global-theme">
        <TooltipProvider>
          <AppContextProvider>
            <AuthWrapper />
            <Toaster />
          </AppContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
