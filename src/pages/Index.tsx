
import { HorseList } from "@/components/horses/HorseList";
import { HorseForm } from "@/components/horses/HorseForm";
import { Button } from "@/components/ui/button";
import { Search, Plus, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Home className="h-6 w-6" />
                Stable Star Tracker
              </Link>
              <Link to="/search" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search className="h-4 w-4" />
                Search Horses
              </Link>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Horse
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Horses</h1>
            <p className="text-gray-600">Manage and track your horse racing stable</p>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Horse</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
              <HorseForm onSuccess={() => setShowForm(false)} />
            </div>
          </div>
        )}

        <HorseList />
      </div>
    </div>
  );
};

export default Index;
