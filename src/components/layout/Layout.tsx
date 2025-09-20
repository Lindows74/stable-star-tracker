import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  onAddHorse?: () => void;
  showAddButton?: boolean;
}

const Layout = ({ children, onAddHorse, showAddButton = false }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation onAddHorse={onAddHorse} showAddButton={showAddButton} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;