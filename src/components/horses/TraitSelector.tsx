import { useState, useRef, memo, useCallback } from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

interface TraitSelectorProps {
  selectedTraits: string[];
  onTraitsChange: (traits: string[]) => void;
}

const TRAIT_CATEGORIES = {
  "General Traits": [
    "Blazing Hoof",
    "Fleet Dash",
    "Agile Arrow",
    "Flash Ignite",
    "To The Moon",
    "Energy Saver",
    "Endless Stride",
    "Rolling Current",
    "Streak Shield"
  ],
  "Surface Preference Traits": [
    "Granite Gallop",
    "Mid Dash",
    "Swampy Strider"
  ],
  "Specific Game Mode Traits": [
    "Lightning Bolt",
    "Top Endurance",
    "Leaping Star",
    "Perfect Step",
    "River Rider",
    "Fast Draw",
    "Revitalizing Surge"
  ],
  "Distance Preference Traits": [
    "Quick Gallop",
    "Swift Trot",
    "Steady Strider",
    "Meadow Runner",
    "Endurance Charger",
    "Marathon Trotter"
  ],
  "Exotic Traits": [
    "Steam Burst",
    "Short Star",
    "Mid Miracle",
    "Marathon Master",
    "Thundering Hooves",
    "Hard 'N' Fast",
    "Meadowstride",
    "Leaping Lancer",
    "Majestic Mane",
    "Crystal Coat",
    "Noble Braid",
    "Kinetic Boost"
  ],
  "Star Club Traits": [
    "Thrifty Spender",
    "Elite Lineage",
    "Top Student"
  ]
};

export const TraitSelector = memo(({ selectedTraits, onTraitsChange }: TraitSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleAddTrait = useCallback((trait: string) => {
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
    setOpen(false);
    setSearchValue("");
  }, [selectedTraits, onTraitsChange]);

  const handleRemoveTrait = useCallback((traitToRemove: string) => {
    const newTraits = selectedTraits.filter(trait => trait !== traitToRemove);
    onTraitsChange(newTraits);
  }, [selectedTraits, onTraitsChange]);

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
        <div className="mt-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                Select a trait to add...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-background z-50">
              <Command>
                <CommandInput 
                  placeholder="Search traits..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList className="max-h-80">
                  <CommandEmpty>No traits found.</CommandEmpty>
                  {Object.entries(TRAIT_CATEGORIES).map(([category, traits]) => {
                    const availableTraits = traits.filter(trait => !selectedTraits.includes(trait));
                    
                    if (availableTraits.length === 0) return null;
                    
                    return (
                      <CommandGroup key={category} heading={category}>
                        {availableTraits.map((trait) => (
                          <CommandItem
                            key={trait}
                            value={trait}
                            onSelect={() => handleAddTrait(trait)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedTraits.includes(trait) ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {trait}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    );
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <FormMessage />
    </div>
  );
});
