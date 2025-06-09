
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface SurfaceSectionProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

const surfaceOptions = [
  { value: "turf", label: "Turf" },
  { value: "dirt", label: "Dirt" },
  { value: "synthetic", label: "Synthetic" },
  { value: "sand", label: "Sand" },
];

export const SurfaceSection = ({ watch, setValue }: SurfaceSectionProps) => {
  const selectedSurfaces = watch("preferred_surfaces") || [];

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
