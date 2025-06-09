
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";

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
  return (
    <div>
      <FormLabel className="text-base font-semibold">Max Training Achieved</FormLabel>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
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
                <FormLabel className="text-sm font-normal">
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
