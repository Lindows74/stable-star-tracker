import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HorseCard } from "./HorseCard";
import type { Tables } from "@/integrations/supabase/types";
import { useState } from "react";

type Horse = Tables<"horses"> & {
  horse_categories?: { category: string }[];
  horse_traits?: { trait_name: string }[];
};

export const HorseList = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  // Sort horses by stats (speed > sprint > acceleration > agility > jump)
  const sortHorsesByStats = (horses: Horse[]) => {
    return horses.sort((a, b) => {
      const getTotalStat = (horse: Horse, stat: keyof Horse, dietStat: keyof Horse) => {
        return ((horse[stat] as number) || 0) + ((horse[dietStat] as number) || 0);
      };

      // Compare speed first
      const aSpeed = getTotalStat(a, 'speed', 'diet_speed');
      const bSpeed = getTotalStat(b, 'speed', 'diet_speed');
      if (aSpeed !== bSpeed) return bSpeed - aSpeed;

      // If speed is equal, compare sprint energy
      const aSprint = getTotalStat(a, 'sprint_energy', 'diet_sprint_energy');
      const bSprint = getTotalStat(b, 'sprint_energy', 'diet_sprint_energy');
      if (aSprint !== bSprint) return bSprint - aSprint;

      // If sprint is equal, compare acceleration
      const aAccel = getTotalStat(a, 'acceleration', 'diet_acceleration');
      const bAccel = getTotalStat(b, 'acceleration', 'diet_acceleration');
      if (aAccel !== bAccel) return bAccel - aAccel;

      // If acceleration is equal, compare agility
      const aAgility = getTotalStat(a, 'agility', 'diet_agility');
      const bAgility = getTotalStat(b, 'agility', 'diet_agility');
      if (aAgility !== bAgility) return bAgility - aAgility;

      // Finally compare jump
      const aJump = getTotalStat(a, 'jump', 'diet_jump');
      const bJump = getTotalStat(b, 'jump', 'diet_jump');
      return bJump - aJump;
    });
  };

  // Filter horses by category
  const filterHorsesByCategory = (horses: Horse[]) => {
    if (categoryFilter === "all") return horses;
    
    return horses.filter(horse => {
      // Include horses that have the selected category OR have "misc" category
      return horse.horse_categories?.some(cat => 
        cat.category === categoryFilter || cat.category === "misc"
      );
    });
  };

  // Group horses by tier
  const groupHorsesByTier = (horses: Horse[]) => {
    const filtered = filterHorsesByCategory(horses);
    const grouped: { [key: number]: Horse[] } = {};
    
    filtered.forEach(horse => {
      const tier = horse.tier || 0; // Default to tier 0 if no tier
      if (!grouped[tier]) {
        grouped[tier] = [];
      }
      grouped[tier].push(horse);
    });

    // Sort horses within each tier by stats
    Object.keys(grouped).forEach(tier => {
      grouped[parseInt(tier)] = sortHorsesByStats(grouped[parseInt(tier)]);
    });

    return grouped;
  };

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

  const groupedHorses = groupHorsesByTier(horses);
  const tiers = Object.keys(groupedHorses).map(Number).sort((a, b) => b - a); // Sort tiers from highest to lowest

  const getTierColor = (tier: number) => {
    if (tier >= 8) return "bg-purple-100 text-purple-800 border-purple-200";
    if (tier >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (tier >= 4) return "bg-green-100 text-green-800 border-green-200";
    if (tier >= 1) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredHorseCount = Object.values(groupedHorses).reduce((total, tierHorses) => total + tierHorses.length, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Horses</h2>
        <div className="flex items-center gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="flat_racing">Flat Racing</SelectItem>
              <SelectItem value="steeplechase">Steeplechase</SelectItem>
              <SelectItem value="cross_country">Cross Country</SelectItem>
              <SelectItem value="misc">Misc</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="text-sm">
            {filteredHorseCount} horse{filteredHorseCount !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>
      
      {tiers.length === 0 ? (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-center text-lg">
              No horses found for the selected category.
            </p>
          </CardContent>
        </Card>
      ) : (
        tiers.map(tier => (
          <div key={tier} className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {tier === 0 ? "No Tier" : `Tier ${tier}`}
              </h3>
              <Badge className={`${getTierColor(tier)} border`}>
                {groupedHorses[tier].length} horse{groupedHorses[tier].length !== 1 ? "s" : ""}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedHorses[tier].map((horse) => (
                <HorseCard key={horse.id} horse={horse} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
