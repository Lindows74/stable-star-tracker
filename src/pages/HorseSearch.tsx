
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HorseCard } from "@/components/horses/HorseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const HorseSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [minTier, setMinTier] = useState<number | null>(null);
  const [maxTier, setMaxTier] = useState<number | null>(null);

  const { data: horses, isLoading, error } = useQuery({
    queryKey: ["horses", "search", searchTerm, selectedCategories, selectedSurfaces, selectedDistances, selectedPositions, selectedTraits, minTier, maxTier],
    queryFn: async () => {
      console.log("HorseSearch: Fetching horses with filters...");
      
      let query = supabase
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
        `);

      // Apply search term filter
      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      // Apply tier filters
      if (minTier !== null) {
        query = query.gte("tier", minTier);
      }
      if (maxTier !== null) {
        query = query.lte("tier", maxTier);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("HorseSearch: Error fetching horses:", error);
        throw error;
      }

      // Filter by categories, surfaces, distances, positions, and traits on the client side
      // since these require joining multiple tables
      let filteredData = data || [];

      if (selectedCategories.length > 0) {
        filteredData = filteredData.filter(horse => 
          horse.horse_categories?.some(cat => selectedCategories.includes(cat.category))
        );
      }

      if (selectedSurfaces.length > 0) {
        filteredData = filteredData.filter(horse => 
          horse.horse_surfaces?.some(surf => selectedSurfaces.includes(surf.surface))
        );
      }

      if (selectedDistances.length > 0) {
        filteredData = filteredData.filter(horse => 
          horse.horse_distances?.some(dist => selectedDistances.includes(dist.distance))
        );
      }

      if (selectedPositions.length > 0) {
        filteredData = filteredData.filter(horse => 
          horse.horse_positions?.some(pos => selectedPositions.includes(pos.position))
        );
      }

      if (selectedTraits.length > 0) {
        filteredData = filteredData.filter(horse => 
          horse.horse_traits?.some(trait => selectedTraits.includes(trait.trait_name))
        );
      }

      console.log("HorseSearch: Filtered horses:", filteredData);
      return filteredData;
    },
  });

  const categories = ["flat_racing", "steeplechase", "cross_country", "misc"];
  const surfaces = ["very_hard", "hard", "firm", "medium", "soft", "very_soft"];
  const distances = ["800", "900", "1000", "1200", "1400", "1600", "1800", "2000", "2200", "2400", "2600", "2800", "3000", "3200"];
  const positions = ["front", "middle", "back"];
  const traits = [
    "Agile Arrow", "Agile Arrow Pro", "Blazing Hoof", "Blazing Hoof Pro", "Fast Draw",
    "Flash Ignite", "Flash Ignite Pro", "Fleet Dash", "Fleet Dash Pro", "Lightning Bolt",
    "Quick Gallop", "Swift Trot", "Thundering Hooves", "Endurance Charger", "Energy Saver",
    "Marathon Master", "Marathon Trotter", "Top Endurance", "Mid Dash", "Mid Miracle",
    "Short Star", "Granite Gallop", "Hard N' Fast", "Meadow Runner", "Meadowstride",
    "River Rider", "Steady Strider", "Swampy Strider", "Leaping Lancer", "Leaping Star",
    "Perfect Step", "Elite Lineage", "Thrifty Spender", "To the Moon", "Top Student"
  ];

  const toggleArrayValue = (array: string[], setValue: (value: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setValue(array.filter(item => item !== value));
    } else {
      setValue([...array, value]);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedSurfaces([]);
    setSelectedDistances([]);
    setSelectedPositions([]);
    setSelectedTraits([]);
    setMinTier(null);
    setMaxTier(null);
  };

  const formatLabel = (value: string) => {
    return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Horses</h1>
        <p className="text-gray-600">Find horses using various filters and criteria</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-6">
              {/* Search by Name */}
              <div>
                <Label htmlFor="search">Horse Name</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tier Range */}
              <div>
                <Label>Tier Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minTier || ""}
                    onChange={(e) => setMinTier(e.target.value ? Number(e.target.value) : null)}
                    min="1"
                    max="10"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxTier || ""}
                    onChange={(e) => setMaxTier(e.target.value ? Number(e.target.value) : null)}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <Label>Categories</Label>
                <div className="mt-2 space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleArrayValue(selectedCategories, setSelectedCategories, category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                        {formatLabel(category)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Surfaces */}
              <div>
                <Label>Preferred Surfaces</Label>
                <div className="mt-2 space-y-2">
                  {surfaces.map((surface) => (
                    <div key={surface} className="flex items-center space-x-2">
                      <Checkbox
                        id={`surface-${surface}`}
                        checked={selectedSurfaces.includes(surface)}
                        onCheckedChange={() => toggleArrayValue(selectedSurfaces, setSelectedSurfaces, surface)}
                      />
                      <Label htmlFor={`surface-${surface}`} className="text-sm font-normal">
                        {formatLabel(surface)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distances */}
              <div>
                <Label>Distances</Label>
                <Select onValueChange={(value) => toggleArrayValue(selectedDistances, setSelectedDistances, value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select distances..." />
                  </SelectTrigger>
                  <SelectContent>
                    {distances.map((distance) => (
                      <SelectItem key={distance} value={distance}>
                        {distance}m
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDistances.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedDistances.map((distance) => (
                      <Badge key={distance} variant="secondary" className="text-xs">
                        {distance}m
                        <button
                          onClick={() => toggleArrayValue(selectedDistances, setSelectedDistances, distance)}
                          className="ml-1 hover:bg-gray-200 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Positions */}
              <div>
                <Label>Field Positions</Label>
                <div className="mt-2 space-y-2">
                  {positions.map((position) => (
                    <div key={position} className="flex items-center space-x-2">
                      <Checkbox
                        id={`position-${position}`}
                        checked={selectedPositions.includes(position)}
                        onCheckedChange={() => toggleArrayValue(selectedPositions, setSelectedPositions, position)}
                      />
                      <Label htmlFor={`position-${position}`} className="text-sm font-normal">
                        {formatLabel(position)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traits */}
              <div>
                <Label>Traits</Label>
                <Select onValueChange={(value) => toggleArrayValue(selectedTraits, setSelectedTraits, value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select traits..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {traits.map((trait) => (
                      <SelectItem key={trait} value={trait}>
                        {trait}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTraits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTraits.map((trait) => (
                      <Badge key={trait} variant="secondary" className="text-xs">
                        {trait}
                        <button
                          onClick={() => toggleArrayValue(selectedTraits, setSelectedTraits, trait)}
                          className="ml-1 hover:bg-gray-200 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load horses. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  {horses?.length || 0} horse{horses?.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {horses && horses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {horses.map((horse) => (
                    <HorseCard key={horse.id} horse={horse} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No horses found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorseSearch;
