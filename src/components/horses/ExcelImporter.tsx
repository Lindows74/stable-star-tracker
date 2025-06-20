
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import * as XLSX from "xlsx";
import type { TablesInsert } from "@/integrations/supabase/types";

interface ExcelImporterProps {
  onSuccess: () => void;
  onClose: () => void;
}

interface ExcelHorseRow {
  name?: string;
  tier?: number;
  speed?: number;
  sprint_energy?: number;
  acceleration?: number;
  agility?: number;
  jump?: number;
  diet_speed?: number;
  diet_sprint_energy?: number;
  diet_acceleration?: number;
  diet_agility?: number;
  diet_jump?: number;
  max_speed?: boolean | string;
  max_sprint_energy?: boolean | string;
  max_acceleration?: boolean | string;
  max_agility?: boolean | string;
  max_jump?: boolean | string;
  notes?: string;
  gender?: string;
  categories?: string;
  preferred_surfaces?: string;
  preferred_distances?: string;
  field_positions?: string;
  traits?: string;
  breeds?: string;
  breed_percentages?: string;
}

export const ExcelImporter = ({ onSuccess, onClose }: ExcelImporterProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ExcelHorseRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processExcelFile(selectedFile);
    }
  };

  const processExcelFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelHorseRow[];
        
        console.log("Parsed Excel data:", jsonData);
        setPreviewData(jsonData);
        setIsProcessing(false);
        
        toast({
          title: "File processed successfully!",
          description: `Found ${jsonData.length} horses to import.`,
        });
      } catch (error) {
        console.error("Error processing Excel file:", error);
        toast({
          title: "Error",
          description: "Failed to process Excel file. Please check the format.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    };
    
    reader.readAsBinaryString(file);
  };

  const parseBoolean = (value: boolean | string | undefined): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return value.toLowerCase() === "true" || value === "1" || value.toLowerCase() === "yes";
    }
    return false;
  };

  const parseArray = (value: string | undefined): string[] => {
    if (!value) return [];
    return value.split(",").map(item => item.trim()).filter(item => item.length > 0);
  };

  const importHorsesMutation = useMutation({
    mutationFn: async (horses: ExcelHorseRow[]) => {
      console.log("Starting import of", horses.length, "horses");
      
      for (const horseRow of horses) {
        if (!horseRow.name) {
          console.log("Skipping horse without name:", horseRow);
          continue;
        }

        console.log("Processing horse:", horseRow.name);

        // Create the horse record
        const horseData: TablesInsert<"horses"> = {
          name: horseRow.name,
          tier: horseRow.tier,
          speed: horseRow.speed,
          sprint_energy: horseRow.sprint_energy,
          acceleration: horseRow.acceleration,
          agility: horseRow.agility,
          jump: horseRow.jump,
          diet_speed: horseRow.diet_speed,
          diet_sprint_energy: horseRow.diet_sprint_energy,
          diet_acceleration: horseRow.diet_acceleration,
          diet_agility: horseRow.diet_agility,
          diet_jump: horseRow.diet_jump,
          max_speed: parseBoolean(horseRow.max_speed),
          max_sprint_energy: parseBoolean(horseRow.max_sprint_energy),
          max_acceleration: parseBoolean(horseRow.max_acceleration),
          max_agility: parseBoolean(horseRow.max_agility),
          max_jump: parseBoolean(horseRow.max_jump),
          notes: horseRow.notes,
          gender: horseRow.gender || null,
        };

        const { data: horse, error: horseError } = await supabase
          .from("horses")
          .insert(horseData)
          .select()
          .single();

        if (horseError) {
          console.error("Error creating horse:", horseError);
          throw new Error(`Failed to create horse ${horseRow.name}: ${horseError.message}`);
        }

        console.log("Horse created:", horse);

        // Insert categories
        const categories = parseArray(horseRow.categories);
        if (categories.length > 0) {
          const categoryInserts = categories.map((category) => ({
            horse_id: horse.id,
            category,
          }));
          
          const { error: categoryError } = await supabase
            .from("horse_categories")
            .insert(categoryInserts);

          if (categoryError) {
            console.error("Error creating categories:", categoryError);
          }
        }

        // Insert surfaces
        const surfaces = parseArray(horseRow.preferred_surfaces);
        if (surfaces.length > 0) {
          const surfaceInserts = surfaces.map((surface) => ({
            horse_id: horse.id,
            surface: surface as "very_hard" | "hard" | "firm" | "medium" | "soft" | "very_soft",
          }));
          
          const { error: surfaceError } = await supabase
            .from("horse_surfaces")
            .insert(surfaceInserts);

          if (surfaceError) {
            console.error("Error creating surfaces:", surfaceError);
          }
        }

        // Insert distances
        const distances = parseArray(horseRow.preferred_distances);
        if (distances.length > 0) {
          const distanceInserts = distances.map((distance) => ({
            horse_id: horse.id,
            distance: distance as "800" | "900" | "1000" | "1200" | "1400" | "1600" | "1800" | "2000" | "2200" | "2400" | "2600" | "2800" | "3000" | "3200",
          }));
          
          const { error: distanceError } = await supabase
            .from("horse_distances")
            .insert(distanceInserts);

          if (distanceError) {
            console.error("Error creating distances:", distanceError);
          }
        }

        // Insert positions
        const positions = parseArray(horseRow.field_positions);
        if (positions.length > 0) {
          const positionInserts = positions.map((position) => ({
            horse_id: horse.id,
            position: position as "front" | "middle" | "back",
          }));
          
          const { error: positionError } = await supabase
            .from("horse_positions")
            .insert(positionInserts);

          if (positionError) {
            console.error("Error creating positions:", positionError);
          }
        }

        // Insert traits
        const traits = parseArray(horseRow.traits);
        if (traits.length > 0) {
          const traitInserts = traits.map((trait) => ({
            horse_id: horse.id,
            trait_name: trait,
            trait_category: "misc" as const,
          }));
          
          const { error: traitError } = await supabase
            .from("horse_traits")
            .insert(traitInserts);

          if (traitError) {
            console.error("Error creating traits:", traitError);
          }
        }

        // Insert breeding data
        const breeds = parseArray(horseRow.breeds);
        const percentages = parseArray(horseRow.breed_percentages);
        
        if (breeds.length > 0 && percentages.length === breeds.length) {
          for (let i = 0; i < breeds.length; i++) {
            const breedName = breeds[i];
            const percentage = parseFloat(percentages[i]);
            
            if (breedName && !isNaN(percentage)) {
              // Get or create breed
              let { data: existingBreed, error: breedFetchError } = await supabase
                .from("breeds")
                .select("id")
                .eq("name", breedName)
                .maybeSingle();

              let breedId: number;

              if (!existingBreed) {
                const { data: newBreed, error: breedCreateError } = await supabase
                  .from("breeds")
                  .insert({ name: breedName })
                  .select("id")
                  .single();

                if (breedCreateError) {
                  console.error("Error creating breed:", breedCreateError);
                  continue;
                }
                breedId = newBreed.id;
              } else if (breedFetchError) {
                console.error("Error fetching breed:", breedFetchError);
                continue;
              } else {
                breedId = existingBreed.id;
              }

              const { error: breedingError } = await supabase
                .from("horse_breeding")
                .insert({
                  horse_id: horse.id,
                  breed_id: breedId,
                  percentage: percentage,
                });

              if (breedingError) {
                console.error("Error creating horse breeding:", breedingError);
              }
            }
          }
        }
      }

      return horses.length;
    },
    onSuccess: (importedCount) => {
      queryClient.invalidateQueries({ queryKey: ["horses"] });
      toast({
        title: "Import successful!",
        description: `Successfully imported ${importedCount} horses.`,
      });
      onSuccess();
    },
    onError: (error: Error) => {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImport = () => {
    if (previewData.length === 0) {
      toast({
        title: "No data to import",
        description: "Please select a valid Excel file first.",
        variant: "destructive",
      });
      return;
    }
    
    importHorsesMutation.mutate(previewData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Import Horses from Excel</h3>
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="excel-file" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Select Excel file
                </span>
                <Input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button variant="outline" className="mt-2" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Selected file: {file.name}
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-4">
            <div className="text-sm text-gray-600">Processing Excel file...</div>
          </div>
        )}

        {previewData.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Preview: {previewData.length} horses found in the file
            </div>
            
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              <div className="p-4 space-y-2">
                {previewData.slice(0, 5).map((horse, index) => (
                  <div key={index} className="text-sm border-b pb-2">
                    <strong>{horse.name}</strong>
                    {horse.tier && <span className="ml-2 text-gray-600">Tier {horse.tier}</span>}
                    {horse.categories && <span className="ml-2 text-blue-600">Categories: {horse.categories}</span>}
                  </div>
                ))}
                {previewData.length > 5 && (
                  <div className="text-sm text-gray-500">
                    ... and {previewData.length - 5} more horses
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleImport}
                disabled={importHorsesMutation.isPending}
                className="flex-1"
              >
                {importHorsesMutation.isPending ? "Importing..." : `Import ${previewData.length} Horses`}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <div><strong>Expected columns:</strong></div>
        <div>name, tier, speed, sprint_energy, acceleration, agility, jump, diet_speed, diet_sprint_energy, diet_acceleration, diet_agility, diet_jump</div>
        <div>max_speed, max_sprint_energy, max_acceleration, max_agility, max_jump (true/false)</div>
        <div>notes, gender, categories, preferred_surfaces, preferred_distances, field_positions, traits (comma-separated)</div>
        <div>breeds, breed_percentages (comma-separated, matching order)</div>
      </div>
    </div>
  );
};
