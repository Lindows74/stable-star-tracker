
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface StatFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  min?: number;
  max?: number;
}

export const StatField = ({ control, name, label, min = 0, max = 300 }: StatFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min={min} 
              max={max} 
              value={typeof field.value === 'number' ? field.value.toString() : ""}
              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
