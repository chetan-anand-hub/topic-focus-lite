import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Dumbbell, TrendingUp, ClipboardCheck, User2, GraduationCap, LogOut } from "lucide-react";
import { useLazyTopper, useDisplayTopicName } from "@/context/LazyTopperContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/practice", label: "Practice", icon: Dumbbell },
  { to: "/app/trends", label: "Exam Trends", icon: TrendingUp },
  { to: "/app/check", label: "Check & Improve", icon: ClipboardCheck },
  { to: "/app/me", label: "Me / Progress", icon: User2 },
];

export function AppSidebar() {
  const { subject, stream, auth, signOut } = useLazyTopper();
  const topicName = useDisplayTopicName();
  const loc = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0">
      <div className="px-5 pt-6 pb-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-display font-bold">L</div>
          <div className="leading-tight">
            <div className="font-display text-lg text-white">LazyTopper</div>
            <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">CBSE Class 10</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                "hover:bg-sidebar-accent hover:text-white",
                isActive ? "bg-sidebar-accent text-white shadow-inner" : "text-sidebar-foreground/85"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/55 mb-1">Current focus</div>
          <div className="text-sm text-white font-medium">
            {subject}
            {subject === "Science" && stream !== "All" ? ` · ${stream}` : ""}
          </div>
          <div className="text-xs text-sidebar-foreground/70 mt-0.5">
            {topicName ? topicName : "No topic selected"}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
          <GraduationCap className="h-3.5 w-3.5" />
          {auth === "trial-active" ? (
            <span className="lt-chip-accent !py-0.5 !px-2">Trial active</span>
          ) : (
            <Link
              to={`/app/login?reason=open-app&redirect=${encodeURIComponent(loc.pathname + loc.search)}`}
              className="underline-offset-2 hover:underline"
            >
              Logged out · Start trial
            </Link>
          )}
        </div>

        {auth === "trial-active" && (
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/85 hover:text-white hover:bg-sidebar-accent"
          >
            <LogOut className="h-3.5 w-3.5" /> Log out
          </Button>
        )}
      </div>
    </aside>
  );
}
