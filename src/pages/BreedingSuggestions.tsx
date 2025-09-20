import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Heart, Star, Zap, Info } from "lucide-react";
import { Link } from "react-router-dom";

const BreedingSuggestions = () => {
  const [filters, setFilters] = useState({
    minTier: "",
    maxTier: "",
    breeds: [] as string[],
    distances: [] as string[],
    surfaces: [] as string[],
    positions: [] as string[],
    traits: [] as string[],
  });

  const breedOptions = [
    "Akhal-Teke", "Appaloosa", "Knabstrupper", "Thoroughbred", 
    "Quarter Horse", "Arabian", "Mustang", "Anglo-Arab", 
    "French Chaser", "Selle Francais"
  ];

  const distanceOptions = [
    "800", "900", "1000", "1100", "1200", "1400", "1600", 
    "1800", "2000", "2200", "2400", "2600", "2800", "3000", "3200"
  ];

  const surfaceOptions = [
    "Very Hard", "Hard", "Firm", "Medium", "Soft", "Very Soft"
  ];

  const positionOptions = ["Front", "Middle", "Back"];

  const traitDescriptions = {
    // Pro Traits
    "Blazing Hoof Pro": "Superior Speed across all game modes.",
    "Fleet Dash Pro": "Superior Sprint Energy across all game modes.",
    "Agile Arrow Pro": "Superior Agility across all game modes.",
    "Flash Ignite Pro": "Superior Acceleration across all game modes.",
    "To The Moon Pro": "Superior Jump across all game modes.",
    "Endless Stride Pro": "On Flat Racing tracks of 2400m or more, gain superior acceleration and Sprint Energy lasts longer.",
    "Rolling Current Pro": "On hard surfaces recharge extra Sprint Energy when jumping and gain superior Acceleration in Cross Country races.",
    "Streak Shield Pro": "In Steeplechase mode, while a perfect streak is active, missing a perfect jump will not break the streak. Activates 3 times per race.",

    // General Traits
    "Blazing Hoof": "Improved Speed across all game modes. Turns Pro if the horse is 80% Thoroughbred.",
    "Fleet Dash": "Improved Sprint Energy across all game modes. Turns Pro if the horse is 80% Arabian or Mustang.",
    "Agile Arrow": "Improved Agility across all game modes. Turns Pro if the horse is 80% Knabstrupper.",
    "Flash Ignite": "Improved Acceleration across all game modes. Turns Pro if the horse is 80% Quarter Horse.",
    "To The Moon": "Improved Jump across all game modes. Turns Pro if the horse is 80% Selle Francais or Knabstrupper.",
    "Energy Saver": "Story Races only costs 1 Career Energy.",
    "Endless Stride": "On Flat Racing tracks of 2400m or more, gains improved acceleration and Sprint Energy lasts longer. Turns pro if horse is 80% or higher Akhal-Teke.",
    "Rolling Current": "On hard surfaces recharge extra Sprint Energy when jumping and gain improved Acceleration in Cross Country races. Turns pro if horse is 80% or higher Anglo-Arab.",
    "Streak Shield": "In Steeplechase mode, while a perfect streak is active, missing a perfect jump will not break the streak. Activates 2 times per race.",

    // Surface Preference
    "Granite Gallop": "Extends preference to hard and very hard surfaces.",
    "Mid Dash": "Extends preference to firm and medium surfaces.",
    "Swampy Strider": "Extends preference to soft and very soft surfaces.",

    // Flat Racing
    "Lightning Bolt": "Faster stamina refill rate during the final stretch in Flat Racing. Can stack with Hard 'N' Fast.",
    "Top Endurance": "Start with more Sprint Energy in Flat Racing.",

    // Steeplechase
    "Leaping Star": "Max jump streak in Steeplechase. Can stack with Leaping Lancer for even further increased jump streak.",
    "Perfect Step": "Improved boost for perfect jumps in Steeplechase. Can stack with Leaping Lancer for even greater boost.",
    "Leaping Lancer": "Max jump streak in Steeplechase is increased by 1. Improved boost when you perform a perfect jump. Can stack with Leaping Star and Perfect Step.",
    "Kinetic Boost": "While your perfect jump streak is 5 or higher, receive bonus sprint energy on each subsequent perfect jump.",

    // Cross Country
    "River Rider": "Horse is not slowed by water in Cross Country.",
    "Fast Draw": "Increased speed boost during jumps in Cross Country.",
    "Meadowstride": "Horse is not slowed down by water in Cross Country. Increased speed boost during jumps in Cross Country.",

    // Distance Preference
    "Quick Gallop": "Extends preference to 800m and 900m.",
    "Swift Trot": "Extends preference to 1,000m, 1,100m, and 1,200m.",
    "Steady Strider": "Extends preference to 1,400m and 1,600m.",
    "Meadow Runner": "Extends preference to 1,800m, 2,000m, and 2,200m.",
    "Endurance Charger": "Extends preference to 2,400m and 2,600m.",
    "Marathon Trotter": "Extends preference to 2,800m, 3,000m, and 3,200m.",

    // Exotic Traits
    "Steam Burst": "On Flat Racing tracks between 800m and 1200m, sprinting increases your acceleration and maximum top speed but uses more Sprint Energy.",
    "Short Star": "Extends preference range to include 1,200m and below.",
    "Mid Miracle": "Extends preference range to include 1,400m to 2,200m.",
    "Marathon Master": "Extends preference range to include 2,400m and higher.",
    "Thundering Hooves": "Starts with full stamina bar. Extends preference range to include 2,800m and higher.",
    "Hard 'N' Fast": "Faster stamina refill rate during final stretch. Extends Preference range to include hard and very hard surfaces. Can stack with Lightning Bolt.",

    // Cosmetic
    "Majestic Mane": "The horse will have a Majestic, Long Mane.",
    "Crystal Coat": "A lustrous coat makes your horse shine like no other.",
    "Noble Braid": "Tightly sewn braids that add refined charm to your horse's presence.",

    // Star Club
    "Thrifty Spender": "Reduced entry fee in Live Events.",
    "Elite Lineage": "Foals born from this horse have +1 to all Base Stats except for A+.",
    "Top Student": "All foals bred from this horse have 20% of their possible XP but still require training."
  };

  const traitsByCategory = {
    "Pro Traits (80%+ Pure Breed)": [
      "Blazing Hoof Pro", "Fleet Dash Pro", "Agile Arrow Pro", "Flash Ignite Pro", 
      "To The Moon Pro", "Endless Stride Pro", "Rolling Current Pro", "Streak Shield Pro"
    ],
    "General Stat Boost": [
      "Blazing Hoof", "Fleet Dash", "Agile Arrow", "Flash Ignite", "To The Moon", "Energy Saver"
    ],
    "Surface Preference": [
      "Granite Gallop", "Mid Dash", "Swampy Strider"
    ],
    "Flat Racing": [
      "Lightning Bolt", "Top Endurance", "Endless Stride"
    ],
    "Steeplechase": [
      "Leaping Star", "Perfect Step", "Streak Shield", "Leaping Lancer", "Kinetic Boost"
    ],
    "Cross Country": [
      "River Rider", "Fast Draw", "Rolling Current", "Meadowstride"
    ],
    "Distance Preference": [
      "Quick Gallop", "Swift Trot", "Steady Strider", "Meadow Runner", 
      "Endurance Charger", "Marathon Trotter"
    ],
    "Exotic Traits (Event Only)": [
      "Steam Burst", "Short Star", "Mid Miracle", "Marathon Master", 
      "Thundering Hooves", "Hard 'N' Fast"
    ],
    "Cosmetic Traits": [
      "Majestic Mane", "Crystal Coat", "Noble Braid"
    ],
    "Star Club Exclusive": [
      "Thrifty Spender", "Elite Lineage", "Top Student"
    ]
  };

  // Flatten all traits for the filter state
  const allTraits = Object.values(traitsByCategory).flat();

  const toggleArrayFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(value)
        ? (prev[category] as string[]).filter(item => item !== value)
        : [...(prev[category] as string[]), value]
    }));
  };

  const breedingCombinations = [
    {
      parents: ["Thoroughbred", "Arabian"],
      expectedTraits: ["Speed Boost", "Stamina Boost"],
      compatibility: "95%",
      description: "Excellent for long distance racing with high speed potential"
    },
    {
      parents: ["Quarter Horse", "Mustang"], 
      expectedTraits: ["Acceleration Boost", "Agility Boost"],
      compatibility: "88%",
      description: "Great for sprint distances with quick acceleration"
    },
    {
      parents: ["Akhal-Teke", "Anglo-Arab"],
      expectedTraits: ["Speed Boost", "Recovery Boost"],
      compatibility: "92%",
      description: "Balanced combination for middle distance racing"
    }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Breeding Suggestions
            </h1>
          </div>
          <p className="text-muted-foreground">
            Find the perfect breeding combinations based on your preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Breeding Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tier Range */}
              <div className="space-y-2">
                <Label>Tier Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    min="1"
                    max="10"
                    value={filters.minTier}
                    onChange={(e) => setFilters(prev => ({...prev, minTier: e.target.value}))}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    min="1"
                    max="10"
                    value={filters.maxTier}
                    onChange={(e) => setFilters(prev => ({...prev, maxTier: e.target.value}))}
                  />
                </div>
              </div>

              <Separator />

              {/* Breeds */}
              <div className="space-y-3">
                <Label>Preferred Breeds</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {breedOptions.map((breed) => (
                    <div key={breed} className="flex items-center space-x-2">
                      <Checkbox
                        id={`breed-${breed}`}
                        checked={filters.breeds.includes(breed)}
                        onCheckedChange={() => toggleArrayFilter('breeds', breed)}
                      />
                      <Label htmlFor={`breed-${breed}`} className="text-sm font-normal">
                        {breed}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Distances */}
              <div className="space-y-3">
                <Label>Target Distances</Label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {distanceOptions.map((distance) => (
                    <div key={distance} className="flex items-center space-x-1">
                      <Checkbox
                        id={`distance-${distance}`}
                        checked={filters.distances.includes(distance)}
                        onCheckedChange={() => toggleArrayFilter('distances', distance)}
                      />
                      <Label htmlFor={`distance-${distance}`} className="text-xs font-normal">
                        {distance}m
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Surfaces */}
              <div className="space-y-3">
                <Label>Preferred Surfaces</Label>
                <div className="grid grid-cols-1 gap-2">
                  {surfaceOptions.map((surface) => (
                    <div key={surface} className="flex items-center space-x-2">
                      <Checkbox
                        id={`surface-${surface}`}
                        checked={filters.surfaces.includes(surface)}
                        onCheckedChange={() => toggleArrayFilter('surfaces', surface)}
                      />
                      <Label htmlFor={`surface-${surface}`} className="text-sm font-normal">
                        {surface}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Traits */}
              <div className="space-y-3">
                <Label>Desired Traits</Label>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {Object.entries(traitsByCategory).map(([category, traits]) => (
                    <div key={category} className="space-y-2">
                      <div className="text-sm font-semibold text-muted-foreground border-b pb-1">
                        {category}
                      </div>
                      <div className="grid grid-cols-1 gap-1 pl-2">
                        {traits.map((trait) => (
                          <div key={trait} className="flex items-center space-x-2">
                            <Checkbox
                              id={`trait-${trait}`}
                              checked={filters.traits.includes(trait)}
                              onCheckedChange={() => toggleArrayFilter('traits', trait)}
                            />
                            <Label htmlFor={`trait-${trait}`} className="text-xs font-normal flex-1">
                              {trait}
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p className="text-sm">{traitDescriptions[trait] || "No description available"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={() => console.log("Search breeding suggestions")}>
                <Zap className="h-4 w-4 mr-2" />
                Find Combinations
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recommended Breeding Combinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {breedingCombinations.map((combo, index) => (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-primary">{combo.parents[0]}</span>
                            <Heart className="h-4 w-4 text-pink-500 mx-2" />
                            <span className="font-semibold text-primary">{combo.parents[1]}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Compatibility</div>
                          <div className="text-lg font-bold text-green-600">{combo.compatibility}</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {combo.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Expected Traits:</div>
                        <div className="flex flex-wrap gap-2">
                          {combo.expectedTraits.map((trait) => (
                            <span
                              key={trait}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">
                          Start Breeding
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default BreedingSuggestions;