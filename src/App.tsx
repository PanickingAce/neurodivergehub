import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { AccountProvider } from "@/contexts/account-context";
import Home from "@/pages/home";
import NeuroRead from "@/pages/neuroread";
import SafePlate from "@/pages/safeplate";
import MindMap from "@/pages/mindmap";
import SensoryShelf from "@/pages/sensoryshelf";
import Settings from "@/pages/settings";
import Recipes from "@/pages/recipes";
import Blogs from "@/pages/blogs";
import Planner from "@/pages/planner";
import Games from "@/pages/games";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/neuroread" component={NeuroRead} />
      <Route path="/safeplate" component={SafePlate} />
      <Route path="/mindmap" component={MindMap} />
      <Route path="/sensoryshelf" component={SensoryShelf} />
      <Route path="/recipes" component={Recipes} />
      <Route path="/blogs" component={Blogs} />
      <Route path="/planner" component={Planner} />
      <Route path="/games" component={Games} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccountProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AccountProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
