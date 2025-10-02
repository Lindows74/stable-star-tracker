
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, X, Save, ChevronsUpDown, Check } from "lucide-react";
import { useState, useEffect, memo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface BreedSelection {
  breed: string;
  percentage: number;
}

interface BreedingSectionProps {
  breedSelections: BreedSelection[];
  setBreedSelections: (selections: BreedSelection[]) => void;
  gender?: "stallion" | "mare";
  setGender?: (gender: "stallion" | "mare" | undefined) => void;
}

const breedOptions = [
  "Arabian",
  "Thoroughbred", 
  "Mustang",
  "Quarter Horse",
  "Selle Francais",
  "Appaloosa",
  "Akhal-Teke",
  "Anglo-Arab",
  "Knabstrupper"
];

export const BreedingSection = memo(({ breedSelections, setBreedSelections, gender, setGender }: BreedingSectionProps) => {
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  const addBreedSelection = useCallback(() => {
    setBreedSelections([...breedSelections, { breed: "", percentage: 0 }]);
    setHasUnsavedChanges(true);
  }, [breedSelections, setBreedSelections]);

  const removeBreedSelection = useCallback((index: number) => {
    const updated = breedSelections.filter((_, i) => i !== index);
    setBreedSelections(updated);
    setHasUnsavedChanges(true);
  }, [breedSelections, setBreedSelections]);

  const updateBreedSelection = useCallback((index: number, field: keyof BreedSelection, value: string | number) => {
    const updated = breedSelections.map((selection, i) => 
      i === index ? { ...selection, [field]: value } : selection
    );
    setBreedSelections(updated);
    setHasUnsavedChanges(true);
  }, [breedSelections, setBreedSelections]);

  const saveBreedingData = useCallback(() => {
    // Validate that all breed selections have both breed and percentage
    const incompleteSelections = breedSelections.some(selection => 
      !selection.breed || selection.percentage <= 0
    );

    if (incompleteSelections) {
      toast({
        title: "Incomplete Breeding Data",
        description: "Please ensure all breed selections have both a breed name and percentage greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setHasUnsavedChanges(false);
    toast({
      title: "Breeding Data Saved",
      description: "Breeding information will be saved when you submit the horse form.",
    });
  }, [breedSelections, toast]);

  const handleStallionChange = useCallback((checked: boolean) => {
    if (setGender) {
      setGender(checked ? "stallion" : undefined);
    }
  }, [setGender]);

  const handleMareChange = useCallback((checked: boolean) => {
    if (setGender) {
      setGender(checked ? "mare" : undefined);
    }
  }, [setGender]);

  const totalPercentage = breedSelections.reduce((sum, selection) => sum + (selection.percentage || 0), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Breeding Information (Optional)</Label>
        <Button type="button" variant="outline" size="sm" onClick={addBreedSelection}>
          <Plus className="h-4 w-4 mr-1" />
          Add Breed
        </Button>
      </div>

      {/* Gender Selection */}
      {setGender && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Gender</Label>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stallion"
                checked={gender === "stallion"}
                onCheckedChange={handleStallionChange}
              />
              <Label htmlFor="stallion" className="text-sm">Stallion</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mare"
                checked={gender === "mare"}
                onCheckedChange={handleMareChange}
              />
              <Label htmlFor="mare" className="text-sm">Mare</Label>
            </div>
          </div>
        </div>
      )}
      
      {breedSelections.length > 0 && (
        <div className="space-y-3">
          {breedSelections.map((selection, index) => (
            <div key={index} className="flex items-center gap-2">
              <Popover 
                open={openPopoverIndex === index} 
                onOpenChange={(open) => setOpenPopoverIndex(open ? index : null)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPopoverIndex === index}
                    className="flex-1 justify-between"
                  >
                    {selection.breed || "Select breed..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover z-[70]">
                  <Command>
                    <CommandInput placeholder="Search breeds..." autoFocus />
                    <CommandList className="max-h-60">
                      <CommandEmpty>No breeds found.</CommandEmpty>
                      <CommandGroup>
                        {breedOptions.map((breed) => (
                          <CommandItem
                            key={breed}
                            value={breed}
                            onSelect={() => {
                              updateBreedSelection(index, "breed", breed);
                              setOpenPopoverIndex(null);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selection.breed === breed ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {breed}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Percentage"
                value={selection.percentage || ""}
                onChange={(e) => updateBreedSelection(index, "percentage", parseInt(e.target.value) || 0)}
                className="w-32"
              />
              
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => removeBreedSelection(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Total: {totalPercentage}%
              {totalPercentage > 100 && (
                <span className="text-red-500 ml-2">Warning: Total exceeds 100%</span>
              )}
              {totalPercentage === 100 && (
                <span className="text-green-600 ml-2">✓ Perfect total</span>
              )}
              {hasUnsavedChanges && (
                <span className="text-orange-500 ml-2">• Unsaved changes</span>
              )}
            </div>
            {hasUnsavedChanges && (
              <Button type="button" variant="default" size="sm" onClick={saveBreedingData}>
                <Save className="h-4 w-4 mr-1" />
                Save Breeds
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.breedSelections === nextProps.breedSelections &&
    prevProps.gender === nextProps.gender &&
    prevProps.setBreedSelections === nextProps.setBreedSelections &&
    prevProps.setGender === nextProps.setGender
  );
});
