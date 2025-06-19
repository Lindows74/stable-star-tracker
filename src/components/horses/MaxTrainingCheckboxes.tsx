
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control, useWatch } from "react-hook-form";

interface MaxTrainingCheckboxesProps {
  control: Control<any>;
}

const MAX_TRAINING_STATS = [
  { name: "max_speed", label: "Max Speed" },
  { name: "max_sprint_energy", label: "Max Sprint Energy" },
  { name: "max_acceleration", label: "Max Acceleration" },
  { name: "max_agility", label: "Max Agility" },
  { name: "max_jump", label: "Max Jump" },
];

export const MaxTrainingCheckboxes = ({ control }: MaxTrainingCheckboxesProps) => {
  // Watch all max training values
  const watchedValues = useWatch({
    control,
    name: ["max_speed", "max_sprint_energy", "max_acceleration", "max_agility", "max_jump"]
  });

  const [maxSpeed, maxSprintEnergy, maxAcceleration, maxAgility, maxJump] = watchedValues || [];
  
  // Check if all stats are maxed
  const allMaxed = maxSpeed && maxSprintEnergy && maxAcceleration && maxAgility && maxJump;
  const someMaxed = maxSpeed || maxSprintEnergy || maxAcceleration || maxAgility || maxJump;

  const handleCheckAll = (checked: boolean) => {
    // Update all max training fields using setValue
    MAX_TRAINING_STATS.forEach(stat => {
      control.setValue(stat.name, checked);
    });
  };

  return (
    <div className="space-y-4">
      <FormLabel className="text-base font-semibold">Max Training Status</FormLabel>
      
      {/* Check All Option */}
      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Checkbox
          id="check-all-max"
          checked={allMaxed}
          onCheckedChange={handleCheckAll}
          className={someMaxed && !allMaxed ? "opacity-50" : ""}
        />
        <FormLabel 
          htmlFor="check-all-max"
          className="font-medium cursor-pointer text-blue-700"
        >
          Fully Max Trained (All Stats)
        </FormLabel>
      </div>

      {/* Individual Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MAX_TRAINING_STATS.map((stat) => (
          <FormField
            key={stat.name}
            control={control}
            name={stat.name as "max_speed" | "max_sprint_energy" | "max_acceleration" | "max_agility" | "max_jump"}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={typeof field.value === 'boolean' ? field.value : false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">
                  {stat.label}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};
