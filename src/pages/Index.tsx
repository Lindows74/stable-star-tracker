
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HorseList } from "@/components/horses/HorseList";
import { HorseForm } from "@/components/horses/HorseForm";
import { Plus } from "lucide-react";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Horse Racing Manager</h1>
          <p className="text-xl text-gray-600 mb-6">Manage your racing horses and track their performance</p>
          
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {showForm ? "Cancel" : "Add New Horse"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Horse</CardTitle>
              <CardDescription>Enter your horse's details and racing stats</CardDescription>
            </CardHeader>
            <CardContent>
              <HorseForm onSuccess={() => setShowForm(false)} />
            </CardContent>
          </Card>
        )}

        <HorseList />
      </div>
    </div>
  );
};

export default Index;
