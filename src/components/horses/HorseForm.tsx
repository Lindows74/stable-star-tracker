import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TraitSelector } from "./TraitSelector";
import { CategorySelector } from "./CategorySelector";
import { StatSection } from "./StatSection";
import { MaxTrainingCheckboxes } from "./MaxTrainingCheckboxes";
import { BasicInfoSection } from "./form/BasicInfoSection";
import { BreedingSection, BreedSelection } from "./form/BreedingSection";
import { SurfaceSection } from "./form/SurfaceSection";
import { DistanceSection } from "./form/DistanceSection";
import { PositionSection } from "./form/PositionSection";
import type { TablesInsert } from "@/integrations/supabase/types";

interface HorseFormProps {
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tier: z.number().min(1).max(10).optional(),
  speed: z.number().min(0).max(300).optional(),
  sprint_energy: z.number().min(0).max(300).optional(),
  acceleration: z.number().min(0).max(300).optional(),
  agility: z.number().min(0).max(300).optional(),
  jump: z.number().min(0).max(300).optional(),
  diet_speed: z.number().min(0).max(50).optional(),
  diet_sprint_energy: z.number().min(0).max(50).optional(),
  diet_acceleration: z.number().min(0).max(50).optional(),
  diet_agility: z.number().min(0).max(50).optional(),
  diet_jump: z.number().min(0).max(50).optional(),
  max_speed: z.boolean().default(false),
  max_sprint_energy: z.boolean().default(false),
  max_acceleration: z.boolean().default(false),
  max_agility: z.boolean().default(false),
  max_jump: z.boolean().default(false),
  notes: z.string().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  preferred_surfaces: z.array(z.string()).min(1, "At least one surface is required"),
  preferred_distances: z.array(z.string()).min(1, "At least one distance is required"),
  field_positions: z.array(z.string()).min(1, "At least one position is required"),
});

const RACING_STATS = [
  { name: "speed", label: "Speed" },
  { name: "sprint_energy", label: "Sprint Energy" },
  { name: "acceleration", label: "Acceleration" },
  { name: "agility", label: "Agility" },
  { name: "jump", label: "Jump" },
];

const DIET_STATS = [
  { name: "diet_speed", label: "Diet Speed", max: 50 },
  { name: "diet_sprint_energy", label: "Diet Sprint Energy", max: 50 },
  { name: "diet_acceleration", label: "Diet Acceleration", max: 50 },
  { name: "diet_agility", label: "Diet Agility", max: 50 },
  { name: "diet_jump", label: "Diet Jump", max: 50 },
];

export const HorseForm = ({ onSuccess }: HorseFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tier: undefined,
      speed: undefined,
      sprint_energy: undefined,
      acceleration: undefined,
      agility: undefined,
      jump: undefined,
      diet_speed: undefined,
      diet_sprint_energy: undefined,
      diet_acceleration: undefined,
      diet_agility: undefined,
      diet_jump: undefined,
      max_speed: false,
      max_sprint_energy: false,
      max_acceleration: false,
      max_agility: false,
      max_jump: false,
      notes: "",
      categories: [],
      preferred_surfaces: [],
      preferred_distances: [],
      field_positions: [],
    },
  });

  const [breedSelections, setBreedSelections] = useState<BreedSelection[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [showDietPlans, setShowDietPlans] = useState(false);
  const [showMaxTraining, setShowMaxTraining] = useState(false);

  const createHorseMutation = useMutation({
    mutationFn: async (horseData: TablesInsert<"horses">) => {
      console.log("Creating horse with data:", horseData);
      
      const { data: horse, error } = await supabase
        .from("horses")
        .insert(horseData)
        .select()
        .single();

      if (error) {
        console.error("Error creating horse:", error);
        throw error;
      }

      // Insert categories
      if (form.getValues("categories").length > 0) {
        const categoryInserts = form.getValues("categories").map((category) => ({
          horse_id: horse.id,
          category,
        }));

        const { error: categoryError } = await supabase
          .from("horse_categories")
          .insert(categoryInserts);

        if (categoryError) {
          console.error("Error creating horse categories:", categoryError);
          throw categoryError;
        }
      }

      // Insert surfaces with proper typing
      if (form.getValues("preferred_surfaces").length > 0) {
        const surfaceInserts = form.getValues("preferred_surfaces").map((surface) => ({
          horse_id: horse.id,
          surface: surface as "very_hard" | "hard" | "firm" | "medium" | "soft" | "very_soft",
        }));

        const { error: surfaceError } = await supabase
          .from("horse_surfaces")
          .insert(surfaceInserts);

        if (surfaceError) {
          console.error("Error creating horse surfaces:", surfaceError);
          throw surfaceError;
        }
      }

      // Insert distances with proper typing
      if (form.getValues("preferred_distances").length > 0) {
        const distanceInserts = form.getValues("preferred_distances").map((distance) => ({
          horse_id: horse.id,
          distance: distance as "800" | "900" | "1000" | "1200" | "1400" | "1600" | "1800" | "2000" | "2200" | "2400" | "2600" | "2800" | "3000" | "3200",
        }));

        const { error: distanceError } = await supabase
          .from("horse_distances")
          .insert(distanceInserts);

        if (distanceError) {
          console.error("Error creating horse distances:", distanceError);
          throw distanceError;
        }
      }

      // Insert positions with proper typing
      if (form.getValues("field_positions").length > 0) {
        const positionInserts = form.getValues("field_positions").map((position) => ({
          horse_id: horse.id,
          position: position as "front" | "middle" | "back",
        }));

        const { error: positionError } = await supabase
          .from("horse_positions")
          .insert(positionInserts);

        if (positionError) {
          console.error("Error creating horse positions:", positionError);
          throw positionError;
        }
      }

      // Handle breeding data
      if (breedSelections.length > 0) {
        console.log("Processing breeding data:", breedSelections);
        
        for (const breedSelection of breedSelections) {
          if (breedSelection.breed && breedSelection.percentage > 0) {
            // First, get or create the breed
            let { data: existingBreed, error: breedFetchError } = await supabase
              .from("breeds")
              .select("id")
              .eq("name", breedSelection.breed)
              .single();

            let breedId: number;

            if (breedFetchError && breedFetchError.code === 'PGRST116') {
              // Breed doesn't exist, create it
              const { data: newBreed, error: breedCreateError } = await supabase
                .from("breeds")
                .insert({ name: breedSelection.breed })
                .select("id")
                .single();

              if (breedCreateError) {
                console.error("Error creating breed:", breedCreateError);
                throw breedCreateError;
              }

              breedId = newBreed.id;
            } else if (breedFetchError) {
              console.error("Error fetching breed:", breedFetchError);
              throw breedFetchError;
            } else {
              breedId = existingBreed.id;
            }

            // Insert the breeding relationship
            const { error: breedingError } = await supabase
              .from("horse_breeding")
              .insert({
                horse_id: horse.id,
                breed_id: breedId,
                percentage: breedSelection.percentage,
              });

            if (breedingError) {
              console.error("Error creating horse breeding:", breedingError);
              throw breedingError;
            }
          }
        }
      }

      // Insert traits if any exist
      if (selectedTraits.length > 0) {
        console.log("Attempting to insert traits:", selectedTraits);
        
        const traitInserts = selectedTraits.map((trait) => ({
          horse_id: horse.id,
          trait_name: trait,
          trait_category: "misc" as const,
        }));

        const { error: traitError } = await supabase
          .from("horse_traits")
          .insert(traitInserts);

        if (traitError) {
          console.error("Error inserting traits:", traitError);
          throw traitError;
        }
      }

      return horse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horses"] });
      toast({
        title: "Success!",
        description: "Horse created successfully",
      });
      
      // Reset form
      form.reset({
        name: "",
        tier: undefined,
        speed: undefined,
        sprint_energy: undefined,
        acceleration: undefined,
        agility: undefined,
        jump: undefined,
        diet_speed: undefined,
        diet_sprint_energy: undefined,
        diet_acceleration: undefined,
        diet_agility: undefined,
        diet_jump: undefined,
        max_speed: false,
        max_sprint_energy: false,
        max_acceleration: false,
        max_agility: false,
        max_jump: false,
        notes: "",
        categories: [],
        preferred_surfaces: [],
        preferred_distances: [],
        field_positions: [],
      });
      setBreedSelections([]);
      setSelectedTraits([]);
      
      onSuccess();
    },
    onError: (error: Error) => {
      console.error("Error creating horse:", error);
      toast({
        title: "Error",
        description: "Failed to create horse. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    
    const horseData: TablesInsert<"horses"> = {
      name: values.name,
      tier: values.tier,
      speed: values.speed,
      sprint_energy: values.sprint_energy,
      acceleration: values.acceleration,
      agility: values.agility,
      jump: values.jump,
      diet_speed: values.diet_speed,
      diet_sprint_energy: values.diet_sprint_energy,
      diet_acceleration: values.diet_acceleration,
      diet_agility: values.diet_agility,
      diet_jump: values.diet_jump,
      max_speed: values.max_speed,
      max_sprint_energy: values.max_sprint_energy,
      max_acceleration: values.max_acceleration,
      max_agility: values.max_agility,
      max_jump: values.max_jump,
      notes: values.notes,
    };

    await createHorseMutation.mutateAsync(horseData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection control={form.control} />

        <BreedingSection 
          breedSelections={breedSelections}
          setBreedSelections={setBreedSelections}
        />

        <CategorySelector control={form.control} />

        <TraitSelector 
          selectedTraits={selectedTraits} 
          onTraitsChange={setSelectedTraits}
        />

        <StatSection 
          control={form.control}
          title="Racing Stats"
          stats={RACING_STATS}
        />

        <Collapsible open={showDietPlans} onOpenChange={setShowDietPlans}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" type="button" className="w-full justify-between">
              Diet Plans (Optional)
              {showDietPlans ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <StatSection 
              control={form.control}
              title="Diet Bonuses"
              stats={DIET_STATS}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={showMaxTraining} onOpenChange={setShowMaxTraining}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" type="button" className="w-full justify-between">
              Max Training Status (Optional)
              {showMaxTraining ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <MaxTrainingCheckboxes control={form.control} />
          </CollapsibleContent>
        </Collapsible>

        <SurfaceSection watch={form.watch} setValue={form.setValue} />

        <DistanceSection watch={form.watch} setValue={form.setValue} />

        <PositionSection watch={form.watch} setValue={form.setValue} />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any notes about this horse..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700" 
          disabled={createHorseMutation.isPending}
        >
          {createHorseMutation.isPending ? "Creating..." : "Add Horse"}
        </Button>
      </form>
    </Form>
  );
};
