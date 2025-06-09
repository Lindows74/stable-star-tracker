
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
  "Speed & Acceleration": [
    "Agile Arrow",
    "Agile Arrow Pro",
    "Blazing Hoof",
    "Blazing Hoof Pro",
    "Fast Draw",
    "Fast Draw Pro",
    "Flash Ignite",
    "Flash Ignite Pro",
    "Fleet Dash",
    "Fleet Dash Pro",
    "Lightning Bolt",
    "Lightning Bolt Pro",
    "Quick Gallop",
    "Quick Gallop Pro",
    "Swift Trot",
    "Swift Trot Pro",
    "Thundering Hooves",
    "Thundering Hooves Pro"
  ],
  "Endurance & Stamina": [
    "Endurance Charger",
    "Endurance Charger Pro",
    "Energy Saver",
    "Energy Saver Pro",
    "Marathon Master",
    "Marathon Master Pro",
    "Marathon Trotter",
    "Marathon Trotter Pro",
    "Top Endurance",
    "Top Endurance Pro"
  ],
  "Distance Specialization": [
    "Mid Dash",
    "Mid Dash Pro",
    "Mid Miracle",
    "Mid Miracle Pro",
    "Short Star",
    "Short Star Pro"
  ],
  "Terrain & Surface": [
    "Granite Gallop",
    "Granite Gallop Pro",
    "Hard N' Fast",
    "Hard N' Fast Pro",
    "Meadow Runner",
    "Meadow Runner Pro",
    "Meadowstride",
    "Meadowstride Pro",
    "River Rider",
    "River Rider Pro",
    "Steady Strider",
    "Steady Strider Pro",
    "Swampy Strider",
    "Swampy Strider Pro"
  ],
  "Jumping & Agility": [
    "Leaping Lancer",
    "Leaping Lancer Pro",
    "Leaping Star",
    "Leaping Star Pro",
    "Perfect Step",
    "Perfect Step Pro"
  ],
  "Special Abilities": [
    "Elite Lineage",
    "Elite Lineage Pro",
    "Thrifty Spender",
    "Thrifty Spender Pro",
    "To the Moon",
    "To the Moon Pro",
    "Top Student",
    "Top Student Pro"
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
