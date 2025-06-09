
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HorseCard } from "./HorseCard";
import type { Tables } from "@/integrations/supabase/types";

type Horse = Tables<"horses"> & {
  horse_categories?: { category: string }[];
  horse_traits?: { trait_name: string }[];
};

export const HorseList = () => {
  const { data: horses, isLoading, error } = useQuery({
    queryKey: ["horses"],
    queryFn: async () => {
      console.log("Fetching horses with categories and traits...");
      
      // First get all horses
      const { data: horsesData, error: horsesError } = await supabase
        .from("horses")
        .select("*")
        .order("created_at", { ascending: false });

      if (horsesError) {
        console.error("Error fetching horses:", horsesError);
        throw horsesError;
      }

      // Then get categories and traits for each horse
      const horsesWithCategoriesAndTraits = await Promise.all(
        horsesData.map(async (horse) => {
          // Fetch categories
          const { data: categories, error: categoriesError } = await supabase
            .from("horse_categories")
            .select("category")
            .eq("horse_id", horse.id);

          if (categoriesError) {
            console.error("Error fetching categories for horse:", horse.id, categoriesError);
          }

          // Fetch traits
          const { data: traits, error: traitsError } = await supabase
            .from("horse_traits")
            .select("trait_name")
            .eq("horse_id", horse.id);

          if (traitsError) {
            console.error("Error fetching traits for horse:", horse.id, traitsError);
          }

          console.log(`Horse ${horse.name} has ${traits?.length || 0} traits:`, traits);

          return {
            ...horse,
            horse_categories: categories || [],
            horse_traits: traits || []
          };
        })
      );
      
      console.log("Fetched horses with categories and traits:", horsesWithCategoriesAndTraits);
      return horsesWithCategoriesAndTraits as Horse[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600 text-center">
            Error loading horses. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!horses || horses.length === 0) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-6">
          <p className="text-gray-600 text-center text-lg">
            No horses found. Add your first horse to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Horses</h2>
        <Badge variant="secondary" className="text-sm">
          {horses.length} horse{horses.length !== 1 ? "s" : ""}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {horses.map((horse) => (
          <HorseCard key={horse.id} horse={horse} />
        ))}
      </div>
    </div>
  );
};
