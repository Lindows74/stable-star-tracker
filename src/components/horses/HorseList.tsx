
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HorseCard } from "./HorseCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const HorseList = () => {
  const { data: horses, isLoading, error } = useQuery({
    queryKey: ["horses"],
    queryFn: async () => {
      console.log("HorseList: Fetching horses...");
      const { data, error } = await supabase
        .from("horses")
        .select(`
          *,
          horse_categories(category),
          horse_surfaces(surface),
          horse_distances(distance),
          horse_positions(position),
          horse_breeding(
            percentage,
            breeds(name)
          ),
          horse_traits(
            trait_name,
            trait_value,
            trait_category
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("HorseList: Error fetching horses:", error);
        throw error;
      }

      console.log("HorseList: Horses fetched successfully:", data);
      
      // Sort horses by total stats (base + diet bonus) in descending order
      const sortedData = data?.sort((a, b) => {
        const aTotalSpeed = (a.speed || 0) + (a.diet_speed || 0);
        const bTotalSpeed = (b.speed || 0) + (b.diet_speed || 0);
        
        if (aTotalSpeed !== bTotalSpeed) {
          return bTotalSpeed - aTotalSpeed; // Speed: high to low
        }
        
        const aTotalSprintEnergy = (a.sprint_energy || 0) + (a.diet_sprint_energy || 0);
        const bTotalSprintEnergy = (b.sprint_energy || 0) + (b.diet_sprint_energy || 0);
        
        if (aTotalSprintEnergy !== bTotalSprintEnergy) {
          return bTotalSprintEnergy - aTotalSprintEnergy; // Sprint Energy: high to low
        }
        
        const aTotalAcceleration = (a.acceleration || 0) + (a.diet_acceleration || 0);
        const bTotalAcceleration = (b.acceleration || 0) + (b.diet_acceleration || 0);
        
        if (aTotalAcceleration !== bTotalAcceleration) {
          return bTotalAcceleration - aTotalAcceleration; // Acceleration: high to low
        }
        
        const aTotalAgility = (a.agility || 0) + (a.diet_agility || 0);
        const bTotalAgility = (b.agility || 0) + (b.diet_agility || 0);
        
        if (aTotalAgility !== bTotalAgility) {
          return bTotalAgility - aTotalAgility; // Agility: high to low
        }
        
        const aTotalJump = (a.jump || 0) + (a.diet_jump || 0);
        const bTotalJump = (b.jump || 0) + (b.diet_jump || 0);
        
        return bTotalJump - aTotalJump; // Jump: high to low
      });

      console.log("HorseList: Horses sorted by stats:", sortedData);
      return sortedData;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load horses. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!horses || horses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No horses yet</h3>
        <p className="text-gray-600">Add your first horse to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {horses.map((horse) => (
        <HorseCard key={horse.id} horse={horse} />
      ))}
    </div>
  );
};
