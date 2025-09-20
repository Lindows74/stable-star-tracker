
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Save } from "lucide-react";
import { useState, useEffect } from "react";
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

export const BreedingSection = ({ breedSelections, setBreedSelections, gender, setGender }: BreedingSectionProps) => {
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const addBreedSelection = () => {
    setBreedSelections([...breedSelections, { breed: "", percentage: 0 }]);
    setHasUnsavedChanges(true);
  };

  const removeBreedSelection = (index: number) => {
    const updated = breedSelections.filter((_, i) => i !== index);
    setBreedSelections(updated);
    setHasUnsavedChanges(true);
  };

  const updateBreedSelection = (index: number, field: keyof BreedSelection, value: string | number) => {
    const updated = breedSelections.map((selection, i) => 
      i === index ? { ...selection, [field]: value } : selection
    );
    setBreedSelections(updated);
    setHasUnsavedChanges(true);
  };

  const saveBreedingData = () => {
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
  };

  const handleStallionChange = (checked: boolean) => {
    if (setGender) {
      setGender(checked ? "stallion" : undefined);
    }
  };

  const handleMareChange = (checked: boolean) => {
    if (setGender) {
      setGender(checked ? "mare" : undefined);
    }
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
};
