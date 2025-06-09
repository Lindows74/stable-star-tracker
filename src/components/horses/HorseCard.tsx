import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MaxTrainingForm } from "./MaxTrainingForm";
import { HorseEditForm } from "./HorseEditForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Edit, Trash2 } from "lucide-react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

interface HorseCardProps {
  horse: Tables<"horses"> & {
    horse_categories?: { category: string }[];
    horse_traits?: { trait_name: string }[];
  };
}

export const HorseCard = ({ horse }: HorseCardProps) => {
  const [showMaxTraining, setShowMaxTraining] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      console.log("Deleting horse:", horse.id);
      
      // Delete horse categories first due to foreign key constraint
      const { error: categoriesError } = await supabase
        .from("horse_categories")
        .delete()
        .eq("horse_id", horse.id);

      if (categoriesError) {
        console.error("Error deleting horse categories:", categoriesError);
        throw categoriesError;
      }

      // Delete horse traits
      const { error: traitsError } = await supabase
        .from("horse_traits")
        .delete()
        .eq("horse_id", horse.id);

      if (traitsError) {
        console.error("Error deleting horse traits:", traitsError);
        throw traitsError;
      }

      // Delete the horse
      const { error: horseError } = await supabase
        .from("horses")
        .delete()
        .eq("id", horse.id);

      if (horseError) {
        console.error("Error deleting horse:", horseError);
        throw horseError;
      }

      // Refresh the horses list
      await queryClient.invalidateQueries({ queryKey: ["horses"] });
      
      toast.success("Horse deleted successfully");
    } catch (error) {
      console.error("Error deleting horse:", error);
      toast.error("Failed to delete horse. Please try again.");
    }
    setShowDeleteDialog(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category.trim()) {
      case "flat_racing":
        return "bg-blue-100 text-blue-800";
      case "steeplechase":
        return "bg-green-100 text-green-800";
      case "cross_country":
        return "bg-orange-100 text-orange-800";
      case "misc":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: number | null) => {
    if (!tier) return "bg-gray-100 text-gray-800";
    if (tier >= 8) return "bg-purple-100 text-purple-800";
    if (tier >= 6) return "bg-yellow-100 text-yellow-800";
    if (tier >= 4) return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  const formatCategoryName = (category: string) => {
    return category.replace("_", " ").toUpperCase();
  };

  // Get categories from the new horse_categories relationship
  const categories = horse.horse_categories?.map(hc => hc.category) || [];
  const traits = horse.horse_traits?.map(ht => ht.trait_name) || [];

  const stats = [
    { 
      name: "Speed", 
      value: horse.speed, 
      dietValue: horse.diet_speed, 
      maxed: horse.max_speed || false
    },
    { 
      name: "Sprint Energy", 
      value: horse.sprint_energy, 
      dietValue: horse.diet_sprint_energy, 
      maxed: horse.max_sprint_energy || false
    },
    { 
      name: "Acceleration", 
      value: horse.acceleration, 
      dietValue: horse.diet_acceleration, 
      maxed: horse.max_acceleration || false
    },
    { 
      name: "Agility", 
      value: horse.agility, 
      dietValue: horse.diet_agility, 
      maxed: horse.max_agility || false
    },
    { 
      name: "Jump", 
      value: horse.jump, 
      dietValue: horse.diet_jump, 
      maxed: horse.max_jump || false
    },
  ];

  if (showEditForm) {
    return <HorseEditForm horse={horse} onCancel={() => setShowEditForm(false)} />;
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {horse.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {horse.tier && (
                    <Badge className={`text-xs ${getTierColor(horse.tier)}`}>
                      Tier {horse.tier}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMaxTraining(!showMaxTraining)}
                    className="h-6 w-6"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {categories.map((category, index) => (
                    <Badge 
                      key={index} 
                      className={`text-xs ${getCategoryColor(category)}`}
                    >
                      {formatCategoryName(category)}
                    </Badge>
                  ))}
                </div>
              )}

              {traits.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-xs font-medium text-gray-600 mb-1">Traits:</h5>
                  <div className="flex flex-wrap gap-1">
                    {traits.map((trait, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="text-xs bg-amber-100 text-amber-800"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Racing Stats</h4>
                {stats.map((stat) => {
                  const totalValue = (stat.value || 0) + (stat.dietValue || 0);
                  
                  return (
                    <div key={stat.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{stat.name}</span>
                          {stat.maxed && (
                            <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-100 text-green-800">
                              MAX
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {totalValue}
                          </span>
                          {stat.dietValue && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              +{stat.dietValue} diet
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Progress
                        value={(totalValue / 300) * 100}
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>

              {showMaxTraining && <MaxTrainingForm horse={horse} />}

              {horse.notes && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 italic">{horse.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Horse
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Horse
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Horse</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{horse.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
