
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

interface MaxTrainingFormProps {
  horse: Tables<"horses">;
}

export const MaxTrainingForm = ({ horse }: MaxTrainingFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [maxedStats, setMaxedStats] = useState({
    speed: horse.max_speed || false,
    sprint_energy: horse.max_sprint_energy || false,
    acceleration: horse.max_acceleration || false,
    agility: horse.max_agility || false,
    jump: horse.max_jump || false,
  });

  const updateMaxTrainingMutation = useMutation({
    mutationFn: async (updatedStats: typeof maxedStats) => {
      console.log("Updating max training for horse:", horse.id, updatedStats);
      
      const { data, error } = await supabase
        .from("horses")
        .update({
          max_speed: updatedStats.speed,
          max_sprint_energy: updatedStats.sprint_energy,
          max_acceleration: updatedStats.acceleration,
          max_agility: updatedStats.agility,
          max_jump: updatedStats.jump,
        })
        .eq("id", horse.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating max training:", error);
        throw error;
      }

      console.log("Updated horse max training:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horses"] });
      toast({
        title: "Success!",
        description: "Max training status updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to update max training status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatChange = (stat: keyof typeof maxedStats, checked: boolean) => {
    setMaxedStats(prev => ({ ...prev, [stat]: checked }));
  };

  const handleCheckAll = (checked: boolean) => {
    const newStats = {
      speed: checked,
      sprint_energy: checked,
      acceleration: checked,
      agility: checked,
      jump: checked,
    };
    setMaxedStats(newStats);
  };

  const handleSave = () => {
    updateMaxTrainingMutation.mutate(maxedStats);
  };

  const allChecked = Object.values(maxedStats).every(Boolean);
  const someChecked = Object.values(maxedStats).some(Boolean);

  const stats = [
    { key: "speed" as const, label: "Speed" },
    { key: "sprint_energy" as const, label: "Sprint Energy" },
    { key: "acceleration" as const, label: "Acceleration" },
    { key: "agility" as const, label: "Agility" },
    { key: "jump" as const, label: "Jump" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Max Training Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b">
          <Checkbox
            id="check-all"
            checked={allChecked}
            onCheckedChange={handleCheckAll}
            className={someChecked && !allChecked ? "opacity-50" : ""}
          />
          <Label 
            htmlFor="check-all"
            className="font-medium cursor-pointer"
          >
            Check All Stats
          </Label>
        </div>

        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.key} className="flex items-center space-x-2">
              <Checkbox
                id={`max-${stat.key}`}
                checked={maxedStats[stat.key]}
                onCheckedChange={(checked) => 
                  handleStatChange(stat.key, checked as boolean)
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

        <Button 
          onClick={handleSave}
          className="w-full"
          disabled={updateMaxTrainingMutation.isPending}
        >
          {updateMaxTrainingMutation.isPending ? "Saving..." : "Save Max Training"}
        </Button>
      </CardContent>
    </Card>
  );
};
