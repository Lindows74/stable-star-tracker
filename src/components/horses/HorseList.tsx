
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HorseCard } from "./HorseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const HorseList = () => {
  const { data: horses, isLoading, error } = useQuery({
    queryKey: ["horses"],
    queryFn: async () => {
      console.log("HorseList: Fetching horses...");
      
      try {
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
        
        if (!data) {
          console.log("HorseList: No data returned");
          return [];
        }

        console.log("HorseList: Number of horses fetched:", data.length);
        console.log("HorseList: Sample horse data:", data[0]);
        return data;
      } catch (err) {
        console.error("HorseList: Catch block error:", err);
        throw err;
      }
    },
  });

  console.log("HorseList: Component render - isLoading:", isLoading, "error:", error, "horses:", horses);

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
    console.log("HorseList: Rendering empty state");
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No horses yet</h3>
        <p className="text-gray-600">Add your first horse to get started.</p>
      </div>
    );
  }

  console.log("HorseList: Rendering horses, count:", horses.length);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {horses.map((horse, index) => {
        console.log(`HorseList: Rendering horse ${index}:`, horse.name, horse.id);
        console.log(`HorseList: Horse ${index} distances:`, horse.horse_distances);
        console.log(`HorseList: Horse ${index} surfaces:`, horse.horse_surfaces);
        console.log(`HorseList: Horse ${index} positions:`, horse.horse_positions);
        return <HorseCard key={horse.id} horse={horse} />;
      })}
    </div>
  );
};
