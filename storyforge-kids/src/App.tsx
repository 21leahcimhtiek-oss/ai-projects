import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Library from "./pages/Library";
import BookDetail from "./pages/BookDetail";
import BatchOperations from "./pages/BatchOperations";
import Pricing from "./pages/Pricing";
import Account from "./pages/Account";
import Analytics from "./pages/Analytics";
import Onboarding from "./pages/Onboarding";
import SharedBooks from "./pages/SharedBooks";
import AnalyticsExport from "./pages/AnalyticsExport";
import NotificationsCenter from "./pages/NotificationsCenter";
import StoryRefinement from "./pages/StoryRefinement";
import FamilyPlan from "./pages/FamilyPlan";
import Achievements from "./pages/Achievements";
import Recommendations from "./pages/Recommendations";
import PrintOnDemand from "./pages/PrintOnDemand";
import CreatorDashboard from "./pages/CreatorDashboard";
import AdvancedSearch from "./pages/AdvancedSearch";
import Community from "./pages/Community";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/onboarding"} component={Onboarding} />
      <Route path={"/library"} component={Library} />
      <Route path={"/books/:id"} component={BookDetail} />
      <Route path={"/batch"} component={BatchOperations} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/account"} component={Account} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/shared-books"} component={SharedBooks} />
      <Route path={"/analytics-export"} component={AnalyticsExport} />
      <Route path={"/notifications"} component={NotificationsCenter} />
      <Route path={"/refine/:id"} component={StoryRefinement} />
      <Route path={"/family-plan"} component={FamilyPlan} />
      <Route path={"/achievements"} component={Achievements} />
      <Route path={"/recommendations"} component={Recommendations} />
      <Route path={"/print"} component={PrintOnDemand} />
      <Route path={"/creator"} component={CreatorDashboard} />
      <Route path={"/search"} component={AdvancedSearch} />
      <Route path={"/community"} component={Community} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
