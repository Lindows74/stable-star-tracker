
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  const addBreed = (breed: string) => {
    if (breedSelections.find(b => b.breed === breed)) return;
    
    const remainingPercentage = 100 - breedSelections.reduce((sum, b) => sum + b.percentage, 0);
    if (remainingPercentage <= 0) return;
    
    setBreedSelections([...breedSelections, { breed, percentage: Math.min(remainingPercentage, 25) }]);
  };

  const removeBreed = (breed: string) => {
    setBreedSelections(breedSelections.filter(b => b.breed !== breed));
  };

  const updatePercentage = (breed: string, percentage: number) => {
    setBreedSelections(breedSelections.map(b => 
      b.breed === breed ? { ...b, percentage: Math.max(0, Math.min(100, percentage)) } : b
    ));
  };

  const totalPercentage = breedSelections.reduce((sum, b) => sum + b.percentage, 0);
  const availableBreeds = breedOptions.filter(breed => 
    !breedSelections.find(b => b.breed === breed)
  );

  return (
    <div className="space-y-3">
      <Label>Breeding Composition</Label>
      
      {breedSelections.length > 0 && (
        <div className="space-y-2">
          {breedSelections.map((selection) => (
            <div key={selection.breed} className="flex items-center gap-2">
              <Badge variant="secondary" className="min-w-20">
                {selection.breed}
              </Badge>
              <Input
                type="number"
                min="0"
                max="100"
                value={selection.percentage}
                onChange={(e) => updatePercentage(selection.breed, parseInt(e.target.value) || 0)}
                className="w-20"
              />
              <span className="text-sm text-gray-600">%</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBreed(selection.breed)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="text-sm text-gray-600">
            Total: {totalPercentage}% {totalPercentage !== 100 && `(${100 - totalPercentage}% remaining)`}
          </div>
        </div>
      )}

      {availableBreeds.length > 0 && totalPercentage < 100 && (
        <Select onValueChange={addBreed}>
          <SelectTrigger>
            <SelectValue placeholder="Add a breed..." />
          </SelectTrigger>
          <SelectContent>
            {availableBreeds.map((breed) => (
              <SelectItem key={breed} value={breed}>
                {breed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
