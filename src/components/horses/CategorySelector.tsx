
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";

interface CategorySelectorProps {
  control: Control<any>;
}

const RACING_CATEGORIES = [
  { id: "flat_racing", label: "Flat Racing" },
  { id: "steeplechase", label: "Steeplechase" },
  { id: "cross_country", label: "Cross Country" },
  { id: "misc", label: "Misc" },
];

export const CategorySelector = ({ control }: CategorySelectorProps) => {
  return (
    <div>
      <FormLabel className="text-base font-semibold">Racing Categories</FormLabel>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {RACING_CATEGORIES.map((category) => (
          <FormField
            key={category.id}
            control={control}
            name="categories"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(category.id)}
                    onCheckedChange={(checked) => {
                      const updatedCategories = checked
                        ? [...(field.value || []), category.id]
                        : (field.value || []).filter((value) => value !== category.id);
                      field.onChange(updatedCategories);
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {category.label}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
      <FormMessage />
    </div>
  );
};
