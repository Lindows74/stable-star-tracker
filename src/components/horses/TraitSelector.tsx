
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

const AVAILABLE_TRAITS = [
  "Blazing Hoof", "To the Moon", "Fleet Dash", "Flash Ignite", "Agile Arrow",
  "Quick Gallop", "Swift Trot", "Steady Strider", "Meadow Runner", "Endurance Charger",
  "Marathon Trotter", "Short Star", "Mid Miracle", "Marathon Master", "Swampy Strider",
  "Mid Dash", "Granite Gallop", "Energy Saver", "Lightning Bolt", "Top Endurance",
  "Thundering Hooves", "Hard N' Fast", "Fast Draw", "River Rider", "Meadowstride",
  "Perfect Step", "Leaping Star", "Leaping Lancer", "Thrifty Spender", "Elite Lineage",
  "Top Student"
];

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
            <SelectContent>
              {AVAILABLE_TRAITS
                .filter(trait => !selectedTraits.includes(trait))
                .map((trait) => (
                  <SelectItem key={trait} value={trait}>
                    {trait}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <FormMessage />
    </div>
  );
};
