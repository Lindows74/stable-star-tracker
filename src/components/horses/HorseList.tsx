
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HorseCard } from "./HorseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const sortHorses = (horses: any[]) => {
  return horses.sort((a, b) => {
    // First sort by tier (higher tier first)
    const tierA = a.tier || 0;
    const tierB = b.tier || 0;
    if (tierA !== tierB) {
      return tierB - tierA;
    }

    // Then by total speed (including diet bonus)
    const totalSpeedA = (a.speed || 0) + (a.diet_speed || 0);
    const totalSpeedB = (b.speed || 0) + (b.diet_speed || 0);
    if (totalSpeedA !== totalSpeedB) {
      return totalSpeedB - totalSpeedA;
    }

    // Then by total sprint energy (including diet bonus)
    const totalSprintEnergyA = (a.sprint_energy || 0) + (a.diet_sprint_energy || 0);
    const totalSprintEnergyB = (b.sprint_energy || 0) + (b.diet_sprint_energy || 0);
    if (totalSprintEnergyA !== totalSprintEnergyB) {
      return totalSprintEnergyB - totalSprintEnergyA;
    }

    // Then by total acceleration (including diet bonus)
    const totalAccelerationA = (a.acceleration || 0) + (a.diet_acceleration || 0);
    const totalAccelerationB = (b.acceleration || 0) + (b.diet_acceleration || 0);
    if (totalAccelerationA !== totalAccelerationB) {
      return totalAccelerationB - totalAccelerationA;
    }

    // Then by total agility (including diet bonus)
    const totalAgilityA = (a.agility || 0) + (a.diet_agility || 0);
    const totalAgilityB = (b.agility || 0) + (b.diet_agility || 0);
    if (totalAgilityA !== totalAgilityB) {
      return totalAgilityB - totalAgilityA;
    }

    // Finally by total jump (including diet bonus)
    const totalJumpA = (a.jump || 0) + (a.diet_jump || 0);
    const totalJumpB = (b.jump || 0) + (b.diet_jump || 0);
    return totalJumpB - totalJumpA;
  });
};

export const HorseList = () => {
  const { data: horses, isLoading, error } = useQuery({
    queryKey: ["horses"],
    queryFn: async () => {
      console.log("HorseList: Fetching horses...");
      
      try {
        // First, let's check the total count of horses in the database
        const { count: totalCount, error: countError } = await supabase
          .from("horses")
          .select("*", { count: 'exact', head: true });
        
        console.log("HorseList: Total horses in database:", totalCount);
        console.log("HorseList: Count query error:", countError);

        // Let's also check what user_id context we're working with
        const { data: currentUser } = await supabase.auth.getUser();
        console.log("HorseList: Current user:", currentUser?.user?.id || "No authenticated user");

        // Now let's try the main query
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
          console.error("HorseList: Supabase error:", error);
          throw error;
        }

        console.log("HorseList: Raw data from Supabase:", data);
        console.log("HorseList: Data type:", typeof data);
        console.log("HorseList: Is array:", Array.isArray(data));
        
        if (!data) {
          console.log("HorseList: No data returned");
          return [];
        }

        console.log("HorseList: Number of horses fetched:", data.length);
        if (data.length > 0) {
          console.log("HorseList: First horse data:", data[0]);
          console.log("HorseList: All horse names:", data.map(h => h.name));
          console.log("HorseList: All horse IDs:", data.map(h => h.id));
          console.log("HorseList: All horse user_ids:", data.map(h => h.user_id));
        }
        
        // Let's also try a simpler query to see if RLS is the issue
        const { data: simpleData, error: simpleError } = await supabase
          .from("horses")
          .select("id, name, user_id");
        
        console.log("HorseList: Simple query result:", simpleData?.length || 0, "horses");
        console.log("HorseList: Simple query error:", simpleError);
        console.log("HorseList: Simple query data:", simpleData);
        
        // Sort horses by tier and stats
        const sortedHorses = sortHorses(data);
        console.log("HorseList: Sorted horses:", sortedHorses.length, "horses");
        console.log("HorseList: Horse names after sorting:", sortedHorses.map(h => h.name));
        
        return sortedHorses;
      } catch (err) {
        console.error("HorseList: Catch block error:", err);
        throw err;
      }
    },
  });

  console.log("HorseList: Component render - isLoading:", isLoading, "error:", error, "horses count:", horses?.length);

  if (isLoading) {
    console.log("HorseList: Rendering loading state");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    console.error("HorseList: Rendering error state:", error);
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load horses. Please try again later. Error: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!horses || horses.length === 0) {
    console.log("HorseList: Rendering empty state - horses:", horses);
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No horses yet</h3>
        <p className="text-gray-600">Add your first horse to get started.</p>
      </div>
    );
  }

  console.log("HorseList: About to render", horses.length, "horses");
  console.log("HorseList: Horse names being rendered:", horses.map(h => h.name));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {horses.map((horse, index) => {
        console.log(`HorseList: Rendering horse ${index + 1}/${horses.length}:`, horse.name, "ID:", horse.id);
        return <HorseCard key={horse.id} horse={horse} />;
      })}
    </div>
  );
};
