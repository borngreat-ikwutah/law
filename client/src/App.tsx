import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import {
  AboutPage,
  ArticleDetailPage,
  AttorneyDetailPage,
  AttorneysPage,
  ContactPage,
  ConsultationPage,
  InsightsPage,
  MissingPage,
  PolicyPage,
  PracticeAreasPage,
  PracticeDetailPage,
} from "./pages/Pages";
import { SiteLayout } from "@/components/site/SiteShell";

const AdminPage = lazy(() =>
  import("@/pages/Admin").then(module => ({ default: module.AdminPage }))
);

function Router() {
  return (
    <Suspense
      fallback={
        <section className="section">
          <div className="container empty-state" role="status">
            Loading secure dashboard…
          </div>
        </section>
      }
    >
      <Switch>
        <Route path="/">
          <SiteLayout>
            <Home />
          </SiteLayout>
        </Route>
        <Route path="/about">
          <SiteLayout>
            <AboutPage />
          </SiteLayout>
        </Route>
        <Route path="/practice-areas">
          <SiteLayout>
            <PracticeAreasPage />
          </SiteLayout>
        </Route>
        <Route path="/practice-areas/:slug">
          <SiteLayout>
            <PracticeDetailPage />
          </SiteLayout>
        </Route>
        <Route path="/attorneys">
          <SiteLayout>
            <AttorneysPage />
          </SiteLayout>
        </Route>
        <Route path="/attorneys/:slug">
          <SiteLayout>
            <AttorneyDetailPage />
          </SiteLayout>
        </Route>
        <Route path="/insights">
          <SiteLayout>
            <InsightsPage />
          </SiteLayout>
        </Route>
        <Route path="/insights/:slug">
          <SiteLayout>
            <ArticleDetailPage />
          </SiteLayout>
        </Route>
        <Route path="/contact">
          <SiteLayout>
            <ContactPage />
          </SiteLayout>
        </Route>
        <Route path="/consultation">
          <SiteLayout>
            <ConsultationPage />
          </SiteLayout>
        </Route>
        <Route path="/privacy">
          <SiteLayout>
            <PolicyPage type="privacy" />
          </SiteLayout>
        </Route>
        <Route path="/terms">
          <SiteLayout>
            <PolicyPage type="terms" />
          </SiteLayout>
        </Route>
        <Route path="/disclaimer">
          <SiteLayout>
            <PolicyPage type="disclaimer" />
          </SiteLayout>
        </Route>
        <Route path="/admin">
          <SiteLayout>
            <AdminPage />
          </SiteLayout>
        </Route>
        <Route path="/404" component={NotFound} />
        <Route>
          <SiteLayout>
            <MissingPage />
          </SiteLayout>
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
export default App;
