import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { SLUG_ALIASES } from "@/lib/topics";

function TopicSlugAliasRedirect() {
  const { slug = "" } = useParams();
  const loc = useLocation();
  const canonical = SLUG_ALIASES[slug] ?? slug;
  return <Navigate to={`/app/topic/${canonical}${loc.search}`} replace />;
}

function PreserveSearchRedirect({ to }: { to: string }) {
  const loc = useLocation();
  return <Navigate to={`${to}${loc.search}`} replace />;
}
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LazyTopperProvider } from "@/context/LazyTopperContext";
import { AppShell } from "@/components/AppShell";
import PublicLanding from "@/pages/PublicLanding";
import HomePage from "@/pages/HomePage";
import PracticePage from "@/pages/PracticePage";
import WorksheetPage from "@/pages/WorksheetPage";
import TrendsPage from "@/pages/TrendsPage";
import TopicHubPage from "@/pages/TopicHubPage";
import CheckPage from "@/pages/CheckPage";
import MePage from "@/pages/MePage";
import LoginGate from "@/pages/LoginGate";
import PrototypeNotes from "@/pages/PrototypeNotes";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LazyTopperProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLanding />} />
            <Route path="/app/login" element={<LoginGate />} />
            <Route path="/app" element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="practice" element={<PracticePage />} />
              <Route path="practice/worksheet" element={<WorksheetPage />} />
              <Route path="trends" element={<TrendsPage />} />
              <Route path="topic/:slug" element={<TopicHubPage />} />
              <Route path="check" element={<CheckPage />} />
              <Route path="me" element={<MePage />} />
              {/* Hidden implementation handoff route — not visible in student UI. */}
              <Route path="notes" element={<PrototypeNotes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LazyTopperProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
