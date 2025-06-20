import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  namn?: string; // Swedish for name
  tier?: number;
  rank?: number; // Swedish uses "Rank"
  speed?: number;
  snabbhet?: number; // Swedish for speed
  sprint_energy?: number;
  sprint?: number; // Swedish for sprint
  acceleration?: number;
  agility?: number;
  rörlighet?: number; // Swedish for agility
  jump?: number;
  hopp?: number; // Swedish for jump
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
  kön?: string; // Swedish for gender
  categories?: string;
  preferred_surfaces?: string;
  underlag?: string; // Swedish for surface
  preferred_distances?: string;
  distans?: string; // Swedish for distance
  field_positions?: string;
  position?: string; // Swedish for position
  traits?: string;
  breeds?: string;
  breed_percentages?: string;
}

// Enhanced translation mappings from Swedish to English
const SWEDISH_TRANSLATIONS = {
  categories: {
    "platt": "flat_racing",
    "hinderbana": "steeplechase", 
    "terräng": "cross_country"
  },
  surfaces: {
    "mycket hård": "very_hard",
    "v mjukt/hård": "medium", // From your data
    "v mjukt": "very_soft",
    "mjukt": "soft", 
    "mjukt/fast": "medium",
    "fast": "firm",
    "medelhård": "medium",
    "hård": "hard",
    "v hård": "very_hard",
    "hård/v hård": "hard",
    "mjukt/fast/medelhård/hård": "medium", // Multiple preferences -> medium
    "v mjukt/fast/medelhård": "medium",
    "mycket mjuk": "very_soft",
    "medel": "medium"
  },
  positions: {
    "fram": "front",
    "mitten": "middle", 
    "bak": "back"
  },
  genders: {
    "hingst": "stallion",
    "sto": "mare",
    "valack": "gelding"
  },
  // Corrected Swedish trait translations based on user feedback
  traits: {
    "blixthov": "Blazing Hoof", // Also matches "Blazing Hoof Pro"
    "snabb galopp": "Quick Gallop",
    "maximal uthållighet": "Top Endurance",
    "perfekt steg": "Perfect Step", // Corrected from "perfekt hållning"
    "snabbast i stan": "Fast Draw", // Corrected from "snabbast start"
    "energisparare": "Energy Saver",
    "maratontravare": "Marathon Trotter", // Corrected from "maratonträvare"
    // Keep any other existing trait translations that weren't corrected
    "flexibel fantom": "flexible_phantom",
    "gränsgalopp": "boundary_gallop",
    "mellani sport": "middle_sport",
    "maximal sport": "maximum_sport",
    "graninglopp": "scrutiny_race"
  }
};

export const ExcelImporter = ({ onSuccess, onClose }: ExcelImporterProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ExcelHorseRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputLanguage, setInputLanguage] = useState<"english" | "swedish">("english");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.name.toLowerCase().endsWith('.csv')) {
        processCsvFile(selectedFile);
      } else {
        processExcelFile(selectedFile);
      }
    }
  };

  const processCsvFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const jsonData: ExcelHorseRow[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row: any = {};
            
            headers.forEach((header, index) => {
              if (values[index] !== undefined) {
                row[header] = values[index];
              }
            });
            
            jsonData.push(row);
          }
        }
        
        console.log("Parsed CSV data:", jsonData);
        setPreviewData(jsonData);
        setIsProcessing(false);
        
        toast({
          title: "CSV file processed successfully!",
          description: `Found ${jsonData.length} horses to import.`,
        });
      } catch (error) {
        console.error("Error processing CSV file:", error);
        toast({
          title: "Error",
          description: "Failed to process CSV file. Please check the format.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(file);
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
          title: "Excel file processed successfully!",
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

  const translateValue = (value: string, translationType: keyof typeof SWEDISH_TRANSLATIONS): string => {
    if (!value || inputLanguage === "english") return value;
    
    const translations = SWEDISH_TRANSLATIONS[translationType];
    const lowerValue = value.toLowerCase().trim();
    
    // Check for exact matches first
    for (const [swedish, english] of Object.entries(translations)) {
      if (lowerValue === swedish.toLowerCase()) {
        return english;
      }
    }
    
    // Return original value if no translation found
    return value;
  };

  const parseBoolean = (value: boolean | string | undefined): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const lowerValue = value.toLowerCase();
      if (inputLanguage === "swedish") {
        return lowerValue === "true" || lowerValue === "1" || lowerValue === "yes" || 
               lowerValue === "ja" || lowerValue === "sant";
      }
      return lowerValue === "true" || lowerValue === "1" || lowerValue === "yes";
    }
    return false;
  };

  const parseArray = (value: string | undefined, translationType?: keyof typeof SWEDISH_TRANSLATIONS): string[] => {
    if (!value) return [];
    const items = value.split(",").map(item => item.trim()).filter(item => item.length > 0);
    
    if (translationType && inputLanguage === "swedish") {
      return items.map(item => translateValue(item, translationType));
    }
    
    return items;
  };

  const normalizeHorseData = (horseRow: ExcelHorseRow) => {
    // Map Swedish column names to English equivalents only if Swedish is selected
    if (inputLanguage === "swedish") {
      return {
        name: horseRow.name || horseRow.namn,
        tier: horseRow.tier || horseRow.rank,
        speed: horseRow.speed || horseRow.snabbhet,
        sprint_energy: horseRow.sprint_energy || horseRow.sprint,
        acceleration: horseRow.acceleration,
        agility: horseRow.agility || horseRow.rörlighet,
        jump: horseRow.jump || horseRow.hopp,
        diet_speed: horseRow.diet_speed,
        diet_sprint_energy: horseRow.diet_sprint_energy,
        diet_acceleration: horseRow.diet_acceleration,
        diet_agility: horseRow.diet_agility,
        diet_jump: horseRow.diet_jump,
        max_speed: horseRow.max_speed,
        max_sprint_energy: horseRow.max_sprint_energy,
        max_acceleration: horseRow.max_acceleration,
        max_agility: horseRow.max_agility,
        max_jump: horseRow.max_jump,
        notes: horseRow.notes,
        gender: horseRow.gender || horseRow.kön,
        categories: horseRow.categories,
        preferred_surfaces: horseRow.preferred_surfaces || horseRow.underlag,
        preferred_distances: horseRow.preferred_distances || horseRow.distans,
        field_positions: horseRow.field_positions || horseRow.position,
        traits: horseRow.traits,
        breeds: horseRow.breeds,
        breed_percentages: horseRow.breed_percentages,
      };
    } else {
      // For English, use the data as-is
      return horseRow;
    }
  };

  const importHorsesMutation = useMutation({
    mutationFn: async (horses: ExcelHorseRow[]) => {
      console.log("Starting import of", horses.length, "horses");
      
      for (const horseRowRaw of horses) {
        // Normalize Swedish column names to English
        const horseRow = normalizeHorseData(horseRowRaw);
        
        if (!horseRow.name) {
          console.log("Skipping horse without name:", horseRowRaw);
          continue;
        }

        console.log("Processing horse:", horseRow.name);

        // Create the horse record with translation
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
          gender: horseRow.gender ? translateValue(horseRow.gender, 'genders') : null,
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

        // Insert categories with translation
        const categories = parseArray(horseRow.categories, 'categories');
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

        // Insert surfaces with translation
        const surfaces = parseArray(horseRow.preferred_surfaces, 'surfaces');
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

        // Insert distances (no translation needed - numbers are universal)
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

        // Insert positions with translation
        const positions = parseArray(horseRow.field_positions, 'positions');
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

        // Insert traits with translation
        const traits = parseArray(horseRow.traits, 'traits');
        if (traits.length > 0) {
          const traitInserts = traits.map((trait) => ({
            horse_id: horse.id,
            trait_name: translateValue(trait, 'traits'),
            trait_category: "misc" as const,
          }));
          
          const { error: traitError } = await supabase
            .from("horse_traits")
            .insert(traitInserts);

          if (traitError) {
            console.error("Error creating traits:", traitError);
          }
        }

        // Insert breeding data (no translation for breed names - keep original)
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
        description: "Please select a valid file first.",
        variant: "destructive",
      });
      return;
    }
    
    importHorsesMutation.mutate(previewData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Import Horses from Excel/CSV</h3>
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Input Language:</label>
          <Select value={inputLanguage} onValueChange={(value: "english" | "swedish") => setInputLanguage(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="swedish">Swedish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Select Excel (.xlsx, .xls) or CSV file
                </span>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
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
            Selected file: {file.name} | Language: {inputLanguage === "swedish" ? "Swedish" : "English"}
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-4">
            <div className="text-sm text-gray-600">Processing file...</div>
          </div>
        )}

        {previewData.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Preview: {previewData.length} horses found in the file
            </div>
            
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              <div className="p-4 space-y-2">
                {previewData.slice(0, 5).map((horse, index) => {
                  const normalizedHorse = normalizeHorseData(horse);
                  return (
                    <div key={index} className="text-sm border-b pb-2">
                      <strong>{normalizedHorse.name}</strong>
                      {normalizedHorse.tier && <span className="ml-2 text-gray-600">Tier {normalizedHorse.tier}</span>}
                      {normalizedHorse.categories && <span className="ml-2 text-blue-600">Categories: {normalizedHorse.categories}</span>}
                    </div>
                  );
                })}
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

      <div className="text-xs text-gray-500 space-y-2">
        <div><strong>Supported formats:</strong> Excel (.xlsx, .xls) and CSV files</div>
        <div><strong>Language selection:</strong> Choose Swedish for automatic translation of categories, surfaces, positions, genders, and traits</div>
        {inputLanguage === "swedish" && (
          <>
            <div><strong>Swedish column mapping:</strong> namn→name, rank→tier, snabbhet→speed, sprint→sprint_energy, rörlighet→agility, hopp→jump, kön→gender, underlag→surfaces, distans→distances</div>
            <div><strong>Swedish examples:</strong> platt/hinderbana/terräng, v mjukt/mjukt/fast/medelhård/hård, fram/mitten/bak, hingst/sto/valack</div>
          </>
        )}
        <div><strong>Expected columns:</strong></div>
        <div>name, tier, speed, sprint_energy, acceleration, agility, jump</div>
        <div>diet_speed, diet_sprint_energy, diet_acceleration, diet_agility, diet_jump</div>
        <div>max_speed, max_sprint_energy, max_acceleration, max_agility, max_jump (true/false)</div>
        <div>notes, gender, categories, preferred_surfaces, preferred_distances, field_positions, traits (comma-separated)</div>
        <div>breeds, breed_percentages (comma-separated, matching order)</div>
      </div>
    </div>
  );
};
