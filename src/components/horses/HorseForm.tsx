import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
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
    breed: "",
    surfaces: [] as string[],
    distances: [] as string[],
  });

  const [maxedStats, setMaxedStats] = useState({
    speed: false,
    sprint_energy: false,
    acceleration: false,
    agility: false,
    jump: false,
  });

  const [showDietPlans, setShowDietPlans] = useState(false);
  const [showMaxTraining, setShowMaxTraining] = useState(false);

  const categoryOptions = [
    { value: "flat_racing", label: "Flat Racing" },
    { value: "steeplechase", label: "Steeplechase" },
    { value: "cross_country", label: "Cross Country" },
  ];

  const surfaceOptions = [
    { value: "very_hard", label: "Very Hard" },
    { value: "hard", label: "Hard" },
    { value: "firm", label: "Firm" },
    { value: "medium", label: "Medium" },
    { value: "soft", label: "Soft" },
    { value: "very_soft", label: "Very Soft" },
  ];

  const distanceOptions = [
    { value: "800", label: "800m" },
    { value: "900", label: "900m" },
    { value: "1000", label: "1000m" },
    { value: "1200", label: "1200m" },
    { value: "1400", label: "1400m" },
    { value: "1600", label: "1600m" },
    { value: "1800", label: "1800m" },
    { value: "2000", label: "2000m" },
    { value: "2200", label: "2200m" },
    { value: "2400", label: "2400m" },
    { value: "2600", label: "2600m" },
    { value: "2800", label: "2800m" },
    { value: "3000", label: "3000m" },
    { value: "3200", label: "3200m" },
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
        breed: "",
        surfaces: [],
        distances: [],
      });
      setMaxedStats({
        speed: false,
        sprint_energy: false,
        acceleration: false,
        agility: false,
        jump: false,
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
    
    // Validation for required fields
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Horse name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.breed.trim()) {
      toast({
        title: "Error",
        description: "Breed is required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.categories.length === 0) {
      toast({
        title: "Error",
        description: "At least one racing category must be selected.",
        variant: "destructive",
      });
      return;
    }

    if (formData.surfaces.length === 0) {
      toast({
        title: "Error",
        description: "At least one preferred surface must be selected.",
        variant: "destructive",
      });
      return;
    }

    if (formData.distances.length === 0) {
      toast({
        title: "Error",
        description: "At least one preferred distance must be selected.",
        variant: "destructive",
      });
      return;
    }
    
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
      max_speed: maxedStats.speed,
      max_sprint_energy: maxedStats.sprint_energy,
      max_acceleration: maxedStats.acceleration,
      max_agility: maxedStats.agility,
      max_jump: maxedStats.jump,
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

  const handleSurfaceChange = (surfaceValue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      surfaces: checked
        ? [...prev.surfaces, surfaceValue]
        : prev.surfaces.filter(surf => surf !== surfaceValue)
    }));
  };

  const handleDistanceChange = (distanceValue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      distances: checked
        ? [...prev.distances, distanceValue]
        : prev.distances.filter(dist => dist !== distanceValue)
    }));
  };

  const handleMaxStatChange = (stat: keyof typeof maxedStats, checked: boolean) => {
    setMaxedStats(prev => ({ ...prev, [stat]: checked }));
  };

  const handleCheckAllMax = (checked: boolean) => {
    setMaxedStats({
      speed: checked,
      sprint_energy: checked,
      acceleration: checked,
      agility: checked,
      jump: checked,
    });
  };

  const allMaxed = Object.values(maxedStats).every(Boolean);
  const someMaxed = Object.values(maxedStats).some(Boolean);

  const maxStatOptions = [
    { key: "speed" as const, label: "Speed" },
    { key: "sprint_energy" as const, label: "Sprint Energy" },
    { key: "acceleration" as const, label: "Acceleration" },
    { key: "agility" as const, label: "Agility" },
    { key: "jump" as const, label: "Jump" },
  ];

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
          <Label htmlFor="breed">Breed *</Label>
          <Input
            id="breed"
            value={formData.breed}
            onChange={(e) => handleInputChange("breed", e.target.value)}
            placeholder="Enter breed"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tier">Tier (1-10) *</Label>
          <Input
            id="tier"
            type="number"
            min="1"
            max="10"
            value={formData.tier}
            onChange={(e) => handleInputChange("tier", e.target.value)}
            placeholder="Enter tier"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Racing Categories *</Label>
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

      <div className="space-y-3">
        <Label>Preferred Surfaces *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {surfaceOptions.map((surface) => (
            <div key={surface.value} className="flex items-center space-x-2">
              <Checkbox
                id={surface.value}
                checked={formData.surfaces.includes(surface.value)}
                onCheckedChange={(checked) => 
                  handleSurfaceChange(surface.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={surface.value}
                className="text-sm font-normal cursor-pointer"
              >
                {surface.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Preferred Distances *</Label>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {distanceOptions.map((distance) => (
            <div key={distance.value} className="flex items-center space-x-2">
              <Checkbox
                id={distance.value}
                checked={formData.distances.includes(distance.value)}
                onCheckedChange={(checked) => 
                  handleDistanceChange(distance.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={distance.value}
                className="text-sm font-normal cursor-pointer"
              >
                {distance.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Racing Stats (1-300) *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="speed">Speed *</Label>
            <Input
              id="speed"
              type="number"
              min="1"
              max="300"
              value={formData.speed}
              onChange={(e) => handleInputChange("speed", e.target.value)}
              placeholder="1-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sprint_energy">Sprint Energy *</Label>
            <Input
              id="sprint_energy"
              type="number"
              min="1"
              max="300"
              value={formData.sprint_energy}
              onChange={(e) => handleInputChange("sprint_energy", e.target.value)}
              placeholder="1-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acceleration">Acceleration *</Label>
            <Input
              id="acceleration"
              type="number"
              min="1"
              max="300"
              value={formData.acceleration}
              onChange={(e) => handleInputChange("acceleration", e.target.value)}
              placeholder="1-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agility">Agility *</Label>
            <Input
              id="agility"
              type="number"
              min="1"
              max="300"
              value={formData.agility}
              onChange={(e) => handleInputChange("agility", e.target.value)}
              placeholder="1-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jump">Jump *</Label>
            <Input
              id="jump"
              type="number"
              min="1"
              max="300"
              value={formData.jump}
              onChange={(e) => handleInputChange("jump", e.target.value)}
              placeholder="1-300"
              required
            />
          </div>
        </div>
      </div>

      <Card className="border-dashed">
        <Collapsible open={showDietPlans} onOpenChange={setShowDietPlans}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Diet Plans (Optional)</CardTitle>
                  <p className="text-sm text-gray-600">Extra points added to stats when racing on preferred surface</p>
                </div>
                {showDietPlans ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
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
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="border-dashed">
        <Collapsible open={showMaxTraining} onOpenChange={setShowMaxTraining}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Max Training Status (Optional)</CardTitle>
                  <p className="text-sm text-gray-600">Mark which stats have been trained to maximum potential</p>
                </div>
                {showMaxTraining ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox
                  id="check-all-max"
                  checked={allMaxed}
                  onCheckedChange={handleCheckAllMax}
                  className={someMaxed && !allMaxed ? "opacity-50" : ""}
                />
                <Label 
                  htmlFor="check-all-max"
                  className="font-medium cursor-pointer"
                >
                  Mark All Stats as MAX
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {maxStatOptions.map((stat) => (
                  <div key={stat.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`max-${stat.key}`}
                      checked={maxedStats[stat.key]}
                      onCheckedChange={(checked) => 
                        handleMaxStatChange(stat.key, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`max-${stat.key}`}
                      className="cursor-pointer"
                    >
                      Max {stat.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

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
