
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { TraitSelector } from "./TraitSelector";
import { StatSection } from "./StatSection";
import { CategorySelector } from "./CategorySelector";
import { MaxTrainingCheckboxes } from "./MaxTrainingCheckboxes";

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
  traits: z.array(z.string()).max(5, "Maximum 5 traits allowed").optional(),
});

interface HorseEditFormProps {
  horse: Tables<"horses"> & {
    horse_categories?: { category: string }[];
    horse_traits?: { trait_name: string }[];
  };
  onCancel: () => void;
}

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

export const HorseEditForm = ({ horse, onCancel }: HorseEditFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: horse.name,
      tier: horse.tier || undefined,
      speed: horse.speed || undefined,
      sprint_energy: horse.sprint_energy || undefined,
      acceleration: horse.acceleration || undefined,
      agility: horse.agility || undefined,
      jump: horse.jump || undefined,
      diet_speed: horse.diet_speed || undefined,
      diet_sprint_energy: horse.diet_sprint_energy || undefined,
      diet_acceleration: horse.diet_acceleration || undefined,
      diet_agility: horse.diet_agility || undefined,
      diet_jump: horse.diet_jump || undefined,
      max_speed: horse.max_speed || false,
      max_sprint_energy: horse.max_sprint_energy || false,
      max_acceleration: horse.max_acceleration || false,
      max_agility: horse.max_agility || false,
      max_jump: horse.max_jump || false,
      notes: horse.notes || "",
      categories: horse.horse_categories?.map(hc => hc.category) || [],
      traits: horse.horse_traits?.map(ht => ht.trait_name) || [],
    },
  });

  useEffect(() => {
    const initialTraits = horse.horse_traits?.map(ht => ht.trait_name) || [];
    setSelectedTraits(initialTraits);
    form.setValue("traits", initialTraits);
  }, [horse.horse_traits, form]);

  const handleTraitsChange = (traits: string[]) => {
    setSelectedTraits(traits);
    form.setValue("traits", traits);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      console.log("Updating horse:", horse.id, values);

      // Update horse data
      const { error: horseError } = await supabase
        .from("horses")
        .update({
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
          updated_at: new Date().toISOString(),
        })
        .eq("id", horse.id);

      if (horseError) {
        console.error("Error updating horse:", horseError);
        throw horseError;
      }

      // Delete existing categories
      const { error: deleteError } = await supabase
        .from("horse_categories")
        .delete()
        .eq("horse_id", horse.id);

      if (deleteError) {
        console.error("Error deleting existing categories:", deleteError);
        throw deleteError;
      }

      // Insert new categories
      if (values.categories.length > 0) {
        const categoryInserts = values.categories.map((category) => ({
          horse_id: horse.id,
          category,
        }));

        const { error: categoryError } = await supabase
          .from("horse_categories")
          .insert(categoryInserts);

        if (categoryError) {
          console.error("Error inserting categories:", categoryError);
          throw categoryError;
        }
      }

      // Delete existing traits
      const { error: deleteTraitsError } = await supabase
        .from("horse_traits")
        .delete()
        .eq("horse_id", horse.id);

      if (deleteTraitsError) {
        console.error("Error deleting existing traits:", deleteTraitsError);
        // Don't throw here, continue without traits if RLS prevents deletion
      }

      // Insert new traits if any exist
      if (values.traits && values.traits.length > 0) {
        console.log("Attempting to insert traits:", values.traits);
        
        // First check if we can insert traits by testing RLS policies
        const { data: testData, error: testError } = await supabase
          .from("horse_traits")
          .select("id")
          .limit(1);

        console.log("RLS test result:", { testData, testError });

        const traitInserts = values.traits.map((trait) => ({
          horse_id: horse.id,
          trait_name: trait,
          trait_category: "misc" as const,
        }));

        const { error: traitError } = await supabase
          .from("horse_traits")
          .insert(traitInserts);

        if (traitError) {
          console.error("Error inserting traits:", traitError);
          // Show a specific error message for RLS issues but don't fail the entire update
          if (traitError.code === "42501") {
            toast.error("Horse updated successfully, but traits could not be saved due to database permissions. Please contact support.");
          } else {
            throw traitError;
          }
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["horses"] });
      toast.success("Horse updated successfully!");
      onCancel();
    } catch (error) {
      console.error("Error updating horse:", error);
      toast.error("Failed to update horse. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Horse: {horse.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horse Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter horse name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier (1-10)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CategorySelector control={form.control} />

            <TraitSelector 
              selectedTraits={selectedTraits} 
              onTraitsChange={handleTraitsChange}
            />

            <StatSection 
              control={form.control}
              title="Racing Stats"
              stats={RACING_STATS}
            />

            <StatSection 
              control={form.control}
              title="Diet Bonuses"
              stats={DIET_STATS}
            />

            <MaxTrainingCheckboxes control={form.control} />

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

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Updating..." : "Update Horse"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
