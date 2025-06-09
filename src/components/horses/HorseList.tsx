
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
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {horses.map((horse) => (
        <HorseCard key={horse.id} horse={horse} />
      ))}
    </div>
  );
};
