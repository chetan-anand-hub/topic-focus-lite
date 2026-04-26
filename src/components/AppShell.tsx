import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useLazyTopper } from "@/context/LazyTopperContext";

export function AppShell() {
  const loc = useLocation();
  const { setLastRoute } = useLazyTopper();

  useEffect(() => {
    setLastRoute(loc.pathname + loc.search);
  }, [loc.pathname, loc.search, setLastRoute]);

  return (
    <div className="min-h-screen w-full flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto lt-scroll">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
