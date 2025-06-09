
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { TablesInsert } from "@/integrations/supabase/types";

interface HorseFormProps {
  onSuccess?: () => void;
}

export const HorseForm = ({ onSuccess }: HorseFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    categories: [] as string[],
    tier: "",
    speed: "",
    sprint_energy: "",
    acceleration: "",
    agility: "",
    jump: "",
    diet_speed: "",
    diet_sprint_energy: "",
    diet_acceleration: "",
    diet_agility: "",
    diet_jump: "",
    notes: "",
  });

  const categoryOptions = [
    { value: "flat_racing", label: "Flat Racing" },
    { value: "steeplechase", label: "Steeplechase" },
    { value: "cross_country", label: "Cross Country" },
  ];

  const createHorseMutation = useMutation({
    mutationFn: async (horseData: TablesInsert<"horses">) => {
      console.log("Creating horse with data:", horseData);
      
      const { data, error } = await supabase
        .from("horses")
        .insert([horseData])
        .select()
        .single();

      if (error) {
        console.error("Error creating horse:", error);
        throw error;
      }

      console.log("Created horse:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horses"] });
      toast({
        title: "Success!",
        description: "Horse has been added successfully.",
      });
      setFormData({
        name: "",
        categories: [],
        tier: "",
        speed: "",
        sprint_energy: "",
        acceleration: "",
        agility: "",
        jump: "",
        diet_speed: "",
        diet_sprint_energy: "",
        diet_acceleration: "",
        diet_agility: "",
        diet_jump: "",
        notes: "",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to add horse. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const horseData: TablesInsert<"horses"> = {
      user_id: "00000000-0000-0000-0000-000000000000", // Temporary placeholder
      name: formData.name,
      category: formData.categories.length > 0 ? formData.categories.join(", ") : null,
      tier: formData.tier ? parseInt(formData.tier) : null,
      speed: formData.speed ? parseInt(formData.speed) : null,
      sprint_energy: formData.sprint_energy ? parseInt(formData.sprint_energy) : null,
      acceleration: formData.acceleration ? parseInt(formData.acceleration) : null,
      agility: formData.agility ? parseInt(formData.agility) : null,
      jump: formData.jump ? parseInt(formData.jump) : null,
      diet_speed: formData.diet_speed ? parseInt(formData.diet_speed) : null,
      diet_sprint_energy: formData.diet_sprint_energy ? parseInt(formData.diet_sprint_energy) : null,
      diet_acceleration: formData.diet_acceleration ? parseInt(formData.diet_acceleration) : null,
      diet_agility: formData.diet_agility ? parseInt(formData.diet_agility) : null,
      diet_jump: formData.diet_jump ? parseInt(formData.diet_jump) : null,
      notes: formData.notes || null,
    };

    createHorseMutation.mutate(horseData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryValue]
        : prev.categories.filter(cat => cat !== categoryValue)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Horse Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter horse name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tier">Tier (1-10)</Label>
          <Input
            id="tier"
            type="number"
            min="1"
            max="10"
            value={formData.tier}
            onChange={(e) => handleInputChange("tier", e.target.value)}
            placeholder="Enter tier"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Racing Categories</Label>
        <div className="flex flex-wrap gap-4">
          {categoryOptions.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={category.value}
                checked={formData.categories.includes(category.value)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={category.value}
                className="text-sm font-normal cursor-pointer"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Racing Stats (1-300)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="speed">Speed</Label>
            <Input
              id="speed"
              type="number"
              min="1"
              max="300"
              value={formData.speed}
              onChange={(e) => handleInputChange("speed", e.target.value)}
              placeholder="1-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sprint_energy">Sprint Energy</Label>
            <Input
              id="sprint_energy"
              type="number"
              min="1"
              max="300"
              value={formData.sprint_energy}
              onChange={(e) => handleInputChange("sprint_energy", e.target.value)}
              placeholder="1-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acceleration">Acceleration</Label>
            <Input
              id="acceleration"
              type="number"
              min="1"
              max="300"
              value={formData.acceleration}
              onChange={(e) => handleInputChange("acceleration", e.target.value)}
              placeholder="1-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agility">Agility</Label>
            <Input
              id="agility"
              type="number"
              min="1"
              max="300"
              value={formData.agility}
              onChange={(e) => handleInputChange("agility", e.target.value)}
              placeholder="1-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jump">Jump</Label>
            <Input
              id="jump"
              type="number"
              min="1"
              max="300"
              value={formData.jump}
              onChange={(e) => handleInputChange("jump", e.target.value)}
              placeholder="1-300"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Diet Plans (1-5)</h3>
        <p className="text-sm text-gray-600">Extra points added to stats when racing on preferred surface</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="diet_speed">Diet Speed</Label>
            <Input
              id="diet_speed"
              type="number"
              min="1"
              max="5"
              value={formData.diet_speed}
              onChange={(e) => handleInputChange("diet_speed", e.target.value)}
              placeholder="1-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diet_sprint_energy">Diet Sprint Energy</Label>
            <Input
              id="diet_sprint_energy"
              type="number"
              min="1"
              max="5"
              value={formData.diet_sprint_energy}
              onChange={(e) => handleInputChange("diet_sprint_energy", e.target.value)}
              placeholder="1-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diet_acceleration">Diet Acceleration</Label>
            <Input
              id="diet_acceleration"
              type="number"
              min="1"
              max="5"
              value={formData.diet_acceleration}
              onChange={(e) => handleInputChange("diet_acceleration", e.target.value)}
              placeholder="1-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diet_agility">Diet Agility</Label>
            <Input
              id="diet_agility"
              type="number"
              min="1"
              max="5"
              value={formData.diet_agility}
              onChange={(e) => handleInputChange("diet_agility", e.target.value)}
              placeholder="1-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diet_jump">Diet Jump</Label>
            <Input
              id="diet_jump"
              type="number"
              min="1"
              max="5"
              value={formData.diet_jump}
              onChange={(e) => handleInputChange("diet_jump", e.target.value)}
              placeholder="1-5"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder="Additional notes about the horse..."
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={createHorseMutation.isPending}
      >
        {createHorseMutation.isPending ? "Adding Horse..." : "Add Horse"}
      </Button>
    </form>
  );
};
