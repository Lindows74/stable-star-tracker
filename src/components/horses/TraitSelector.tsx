
import { useState } from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  };

  const handleRemoveTrait = (traitToRemove: string) => {
    const newTraits = selectedTraits.filter(trait => trait !== traitToRemove);
    onTraitsChange(newTraits);
  };

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

      {/* Trait Selection Dropdown */}
      {selectedTraits.length < 5 && (
        <div className="mt-2">
          <Select onValueChange={handleAddTrait}>
            <SelectTrigger>
              <SelectValue placeholder="Select a trait to add..." />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {Object.entries(TRAIT_CATEGORIES).map(([category, traits]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-50 border-b">
                    {category}
                  </div>
                  {traits
                    .filter(trait => !selectedTraits.includes(trait))
                    .map((trait) => (
                      <SelectItem key={trait} value={trait} className="pl-4">
                        {trait}
                      </SelectItem>
                    ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <FormMessage />
    </div>
  );
};
