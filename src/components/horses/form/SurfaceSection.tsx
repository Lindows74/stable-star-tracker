
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Control, useWatch } from "react-hook-form";
import { useFormContext } from "react-hook-form";

interface SurfaceSectionProps {
  control: Control<any>;
}

const surfaceOptions = [
  { value: "very_hard", label: "Very Hard" },
  { value: "hard", label: "Hard" },
  { value: "firm", label: "Firm" },
  { value: "medium", label: "Medium" },
  { value: "soft", label: "Soft" },
  { value: "very_soft", label: "Very Soft" },
];

export const SurfaceSection = ({ control }: SurfaceSectionProps) => {
  const { setValue } = useFormContext();
  const selectedSurfaces = useWatch({
    control,
    name: "preferred_surfaces",
    defaultValue: []
  });

  const toggleSurface = (surface: string) => {
    const updated = selectedSurfaces.includes(surface)
      ? selectedSurfaces.filter((s: string) => s !== surface)
      : [...selectedSurfaces, surface];
    setValue("preferred_surfaces", updated);
  };

  return (
    <div className="space-y-3">
      <Label>Preferred Surfaces *</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {surfaceOptions.map((surface) => (
          <div key={surface.value} className="flex items-center space-x-2">
            <Checkbox
              id={surface.value}
              checked={selectedSurfaces.includes(surface.value)}
              onCheckedChange={() => toggleSurface(surface.value)}
            />
            <Label htmlFor={surface.value} className="text-sm font-normal">
              {surface.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
