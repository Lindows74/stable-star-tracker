import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Star, Zap } from "lucide-react";
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

  const traitOptions = [
    // Multi Modes
    "Burst of Speed", "Photo Finish", "Acceleration", "Stamina", "Agility", "Jump", 
    "Burst of Strength", "Lightning Speed", "Acceleration Boost", "Speed Boost", 
    "Stamina Boost", "Agility Boost", "Jump Boost", "Recovery Boost",
    
    // Flat Racing
    "Front Runner", "Stalker", "Closer", "Deep Closer", "Pacesetter", "Rail Runner", 
    "Mudder", "Turf Specialist", "Distance Specialist", "Sprint Specialist", 
    "Miler Specialist", "Route Specialist", "Early Speed", "Late Speed",
    
    // Steeplechase
    "Jumper", "Sure Footed", "Obstacle Specialist", "Steeplechase Champion", 
    "Hurdle Master", "Cross Country Expert",
    
    // Cross Country
    "Endurance", "Hill Climber", "Terrain Master", "Cross Country Specialist",
    "All Weather", "Mud Runner", "Firm Ground",
    
    // Misc
    "Crowd Pleaser", "Camera Shy", "Early Developer", "Late Developer", 
    "Consistent", "Temperamental", "Trainer's Pet", "Hard to Handle"
  ];

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
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {traitOptions.map((trait) => (
                    <div key={trait} className="flex items-center space-x-2">
                      <Checkbox
                        id={`trait-${trait}`}
                        checked={filters.traits.includes(trait)}
                        onCheckedChange={() => toggleArrayFilter('traits', trait)}
                      />
                      <Label htmlFor={`trait-${trait}`} className="text-sm font-normal">
                        {trait}
                      </Label>
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
  );
};

export default BreedingSuggestions;