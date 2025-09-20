import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Heart, Plus } from "lucide-react";

interface NavigationProps {
  onAddHorse?: () => void;
  showAddButton?: boolean;
}

const Navigation = ({ onAddHorse, showAddButton = false }: NavigationProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/search", label: "Search Horses", icon: Search },
    { path: "/breeding", label: "Live Events", icon: Heart },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <h1 className="text-xl font-bold mr-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Stable Star Tracker
              </Link>
            </h1>
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    className="flex items-center gap-2"
                  >
                    <Link to={item.path}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
          
          {showAddButton && (
            <Button onClick={onAddHorse} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Horse
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;