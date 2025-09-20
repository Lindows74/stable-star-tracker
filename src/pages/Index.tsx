import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { HorseList } from "@/components/horses/HorseList";
import { HorseForm } from "@/components/horses/HorseForm";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddHorse = () => {
    setShowForm(!showForm);
  };

  return (
    <Layout onAddHorse={handleAddHorse} showAddButton>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Horses</h2>
          <p className="text-muted-foreground">
            Manage your horse collection and track their stats and traits.
          </p>
        </div>

        {showForm && (
          <div className="bg-card rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Horse</h3>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
            <HorseForm onSuccess={() => setShowForm(false)} />
          </div>
        )}

        <div className="bg-card rounded-lg border">
          <HorseList />
        </div>
      </div>
    </Layout>
  );
};

export default Index;