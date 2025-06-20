
import { useState } from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

interface TraitSelectorProps {
  selectedTraits: string[];
  onTraitsChange: (traits: string[]) => void;
}

const TRAIT_CATEGORIES = {
  "Pro Traits": [
    "Blazing Hoof Pro",
    "Fleet Dash Pro", 
    "Agile Arrow Pro",
    "Flash Ignite Pro",
    "To The Moon Pro",
    "Endless Stride Pro",
    "Rolling Current Pro"
  ],
  "Speed & Acceleration": [
    "Blazing Hoof",
    "Flash Ignite",
    "Lightning Bolt",
    "Fast Draw",
    "Saxon Burst"
  ],
  "Endurance & Stamina": [
    "Fleet Dash",
    "Energy Saver",
    "Endless Stride",
    "Top Endurance",
    "Thundering Hooves",
    "Saxon Soul"
  ],
  "Distance Specialization": [
    "Quick Gallop",
    "Swift Trot",
    "Steady Strider", 
    "Meadow Runner",
    "Endurance Charger",
    "Marathon Trotter",
    "Short Star",
    "Mid Miracle",
    "Marathon Master"
  ],
  "Terrain & Surface": [
    "Granite Gallop",
    "Mid Dash",
    "Swampy Strider",
    "Rolling Current",
    "Hard N' Fast",
    "Meadowstride",
    "River Rider"
  ],
  "Jumping & Agility": [
    "Agile Arrow",
    "To The Moon",
    "Leaping Star",
    "Perfect Step",
    "Leaping Lancer",
    "Menace Mane"
  ],
  "Special Abilities": [
    "Hefty Spender",
    "Firm Lineage", 
    "Top Student",
    "Thrifty Spender",
    "Elite Lineage",
    "Crystal Gift"
  ]
};

export const TraitSelector = ({ selectedTraits, onTraitsChange }: TraitSelectorProps) => {
  const [selectKey, setSelectKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      toast.error("Trait already selected");
      return;
    }
    
    if (selectedTraits.length >= 5) {
      toast.error("Maximum 5 traits allowed");
      return;
    }

    const newTraits = [...selectedTraits, trait];
    onTraitsChange(newTraits);
    
    // Reset the select component to show placeholder again
    setSelectKey(prev => prev + 1);
    setSearchTerm(""); // Clear search when trait is added
  };

  const handleRemoveTrait = (traitToRemove: string) => {
    const newTraits = selectedTraits.filter(trait => trait !== traitToRemove);
    onTraitsChange(newTraits);
  };

  // Filter traits based on search term
  const getFilteredTraits = (traits: string[]) => {
    if (!searchTerm) return traits;
    return traits.filter(trait => 
      trait.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get all available traits for search
  const getAllAvailableTraits = () => {
    const allTraits: string[] = [];
    Object.values(TRAIT_CATEGORIES).forEach(categoryTraits => {
      categoryTraits.forEach(trait => {
        if (!selectedTraits.includes(trait)) {
          allTraits.push(trait);
        }
      });
    });
    return allTraits;
  };

  const filteredAllTraits = searchTerm ? 
    getAllAvailableTraits().filter(trait => 
      trait.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  return (
    <div>
      <FormLabel className="text-base font-semibold">Horse Traits (Max 5)</FormLabel>
      
      {/* Selected Traits Display */}
      {selectedTraits.length > 0 && (
        <div className="mt-2 mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedTraits.map((trait) => (
              <Badge 
                key={trait} 
                variant="secondary" 
                className="flex items-center gap-1 bg-amber-100 text-amber-800"
              >
                {trait}
                <button
                  type="button"
                  onClick={() => handleRemoveTrait(trait)}
                  className="ml-1 hover:bg-amber-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {selectedTraits.length}/5 traits selected
          </p>
        </div>
      )}

      {/* Trait Selection */}
      {selectedTraits.length < 5 && (
        <div className="mt-2 space-y-3">
          {/* Search Input */}
          <div>
            <Input
              placeholder="Search traits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Show filtered results when searching */}
          {searchTerm && (
            <div className="max-h-48 overflow-y-auto border rounded-md bg-white">
              {filteredAllTraits.length > 0 ? (
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Search Results ({filteredAllTraits.length})
                  </div>
                  <div className="space-y-1">
                    {filteredAllTraits.map((trait) => (
                      <button
                        key={trait}
                        type="button"
                        onClick={() => handleAddTrait(trait)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        {trait}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No traits found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}

          {/* Category Dropdown (shown when not searching) */}
          {!searchTerm && (
            <Select key={selectKey} onValueChange={handleAddTrait} value="">
              <SelectTrigger>
                <SelectValue placeholder="Select a trait to add..." />
              </SelectTrigger>
              <SelectContent className="max-h-80 bg-white">
                {Object.entries(TRAIT_CATEGORIES).map(([category, traits]) => {
                  const availableTraits = traits.filter(trait => !selectedTraits.includes(trait));
                  
                  if (availableTraits.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-50 border-b">
                        {category}
                      </div>
                      {availableTraits.map((trait) => (
                        <SelectItem key={trait} value={trait} className="pl-4">
                          {trait}
                        </SelectItem>
                      ))}
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      <FormMessage />
    </div>
  );
};
