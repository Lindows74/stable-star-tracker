
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export interface BreedSelection {
  breed: string;
  percentage: number;
}

interface BreedingSectionProps {
  breedSelections: BreedSelection[];
  setBreedSelections: (selections: BreedSelection[]) => void;
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

export const BreedingSection = ({ breedSelections, setBreedSelections }: BreedingSectionProps) => {
  const addBreedSelection = () => {
    setBreedSelections([...breedSelections, { breed: "", percentage: 0 }]);
  };

  const removeBreedSelection = (index: number) => {
    const updated = breedSelections.filter((_, i) => i !== index);
    setBreedSelections(updated);
  };

  const updateBreedSelection = (index: number, field: keyof BreedSelection, value: string | number) => {
    const updated = breedSelections.map((selection, i) => 
      i === index ? { ...selection, [field]: value } : selection
    );
    setBreedSelections(updated);
  };

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
      
      {breedSelections.length > 0 && (
        <div className="space-y-3">
          {breedSelections.map((selection, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select 
                value={selection.breed} 
                onValueChange={(value) => updateBreedSelection(index, "breed", value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  {breedOptions.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
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
          
          <div className="text-sm">
            Total: {totalPercentage}%
            {totalPercentage > 100 && (
              <span className="text-red-500 ml-2">Warning: Total exceeds 100%</span>
            )}
            {totalPercentage === 100 && (
              <span className="text-green-600 ml-2">✓ Perfect total</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
