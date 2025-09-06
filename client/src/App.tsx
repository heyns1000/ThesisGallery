import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Documents from "@/pages/documents";
import GalleryPage from "@/pages/gallery";
import Conversations from "@/pages/conversations";
import Brands from "@/pages/brands";
import Compliance from "@/pages/compliance";
import Automation from "@/pages/automation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/documents" component={Documents} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/conversations" component={Conversations} />
      <Route path="/brands" component={Brands} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/automation" component={Automation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
