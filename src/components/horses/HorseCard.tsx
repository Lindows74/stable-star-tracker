
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { HorseEditForm } from "./HorseEditForm";
import { TraitBadge } from "./TraitBadge";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HorseCardProps {
  horse: any;
}

// Define traits that give full stamina
const FULL_STAMINA_TRAITS = ["Thundering Hooves", "Top Endurance"];

export const HorseCard = ({ horse }: HorseCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (horseId: number) => {
      console.log("HorseCard: Deleting horse with ID:", horseId);
      
      // Delete related records first
      await supabase.from("horse_categories").delete().eq("horse_id", horseId);
      await supabase.from("horse_surfaces").delete().eq("horse_id", horseId);
      await supabase.from("horse_distances").delete().eq("horse_id", horseId);
      await supabase.from("horse_positions").delete().eq("horse_id", horseId);
      await supabase.from("horse_breeding").delete().eq("horse_id", horseId);
      await supabase.from("horse_traits").delete().eq("horse_id", horseId);
      
      // Delete the horse
      const { error } = await supabase.from("horses").delete().eq("id", horseId);
      if (error) throw error;
    },
    onSuccess: () => {
      console.log("HorseCard: Horse deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["horses"] });
      toast({
        title: "Success",
        description: "Horse deleted successfully",
      });
    },
    onError: (error) => {
      console.error("HorseCard: Error deleting horse:", error);
      toast({
        title: "Error",
        description: "Failed to delete horse",
        variant: "destructive",
      });
    },
  });

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit {horse.name}</h3>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)}
            size="sm"
          >
            Cancel
          </Button>
        </div>
        <HorseEditForm 
          horse={horse} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  const totalSpeed = (horse.speed || 0) + (horse.diet_speed || 0);
  const totalSprintEnergy = (horse.sprint_energy || 0) + (horse.diet_sprint_energy || 0);
  const totalAcceleration = (horse.acceleration || 0) + (horse.diet_acceleration || 0);
  const totalAgility = (horse.agility || 0) + (horse.diet_agility || 0);
  const totalJump = (horse.jump || 0) + (horse.diet_jump || 0);

  const maxTrainedStats = [
    horse.max_speed && "Speed",
    horse.max_sprint_energy && "Sprint Energy", 
    horse.max_acceleration && "Acceleration",
    horse.max_agility && "Agility",
    horse.max_jump && "Jump"
  ].filter(Boolean);

  // Determine gender background color for the name
  const getGenderNameBackgroundClass = (gender: string) => {
    if (gender === 'stallion') return 'bg-blue-200 border border-blue-300';
    if (gender === 'mare') return 'bg-pink-200 border border-pink-300';
    return 'bg-gray-200 border border-gray-300';
  };

  // Extract all trait names for stacking detection
  const allTraitNames = horse.horse_traits?.map((trait: any) => trait.trait_name) || [];
  
  // Check if horse has full stamina traits
  const hasFullStaminaTrait = allTraitNames.some((traitName: string) => 
    FULL_STAMINA_TRAITS.includes(traitName)
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`inline-block px-3 py-2 rounded-lg ${getGenderNameBackgroundClass(horse.gender || '')}`}>
              <CardTitle className="text-lg flex items-center gap-1">
                {horse.name}
                {hasFullStaminaTrait && <span className="text-lg">💯</span>}
              </CardTitle>
            </div>
            {horse.tier && (
              <Badge variant="secondary">
                Tier {horse.tier}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Horse</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {horse.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(horse.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Breed Information */}
        {horse.horse_breeding && horse.horse_breeding.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Breed Composition</h4>
            <div className="space-y-1">
              {horse.horse_breeding.map((breeding: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{breeding.breeds?.name || 'Unknown Breed'}</span>
                  <Badge variant="outline" className="text-xs">
                    {breeding.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {horse.horse_categories && horse.horse_categories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-1">
              {horse.horse_categories.map((cat: any, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {cat.category?.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div>
          <h4 className="text-sm font-medium mb-2">Stats</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="font-medium">
                {totalSpeed}
                {horse.diet_speed > 0 && (
                  <span className="text-green-600"> (+{horse.diet_speed})</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sprint Energy:</span>
              <span className="font-medium">
                {totalSprintEnergy}
                {horse.diet_sprint_energy > 0 && (
                  <span className="text-green-600"> (+{horse.diet_sprint_energy})</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Acceleration:</span>
              <span className="font-medium">
                {totalAcceleration}
                {horse.diet_acceleration > 0 && (
                  <span className="text-green-600"> (+{horse.diet_acceleration})</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Agility:</span>
              <span className="font-medium">
                {totalAgility}
                {horse.diet_agility > 0 && (
                  <span className="text-green-600"> (+{horse.diet_agility})</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Jump:</span>
              <span className="font-medium">
                {totalJump}
                {horse.diet_jump > 0 && (
                  <span className="text-green-600"> (+{horse.diet_jump})</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Racing Info */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {horse.horse_surfaces && horse.horse_surfaces.length > 0 && (
            <div>
              <span className="font-medium">Surface:</span>
              <div className="mt-1">
                {horse.horse_surfaces.map((surf: any, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs mr-1">
                    {surf.surface?.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {horse.horse_distances && horse.horse_distances.length > 0 && (
            <div>
              <span className="font-medium">Distance:</span>
              <div className="mt-1">
                {horse.horse_distances.map((dist: any, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs mr-1">
                    {dist.distance}m
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {horse.horse_positions && horse.horse_positions.length > 0 && (
            <div>
              <span className="font-medium">Position:</span>
              <div className="mt-1">
                {horse.horse_positions.map((pos: any, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs mr-1">
                    {pos.position}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Traits */}
        {horse.horse_traits && horse.horse_traits.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Traits</h4>
            <div className="flex flex-wrap gap-1">
              {horse.horse_traits.map((trait: any, idx: number) => (
                <TraitBadge 
                  key={idx} 
                  traitName={trait.trait_name}
                  allTraits={allTraitNames}
                />
              ))}
            </div>
          </div>
        )}

        {/* Max Training Status */}
        {maxTrainedStats.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Max Trained</h4>
            <div className="flex flex-wrap gap-1">
              {maxTrainedStats.map((stat, idx) => (
                <Badge key={idx} variant="default" className="text-xs bg-green-100 text-green-800">
                  {stat}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {horse.notes && (
          <div>
            <h4 className="text-sm font-medium mb-1">Notes</h4>
            <p className="text-sm text-gray-600">{horse.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
