
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface PositionSectionProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

const positionOptions = [
  { value: "front", label: "Front" },
  { value: "middle", label: "Middle" },
  { value: "back", label: "Back" },
];

export const PositionSection = ({ watch, setValue }: PositionSectionProps) => {
  const selectedPositions = watch("field_positions") || [];

  const togglePosition = (position: string) => {
    const updated = selectedPositions.includes(position)
      ? selectedPositions.filter((p: string) => p !== position)
      : [...selectedPositions, position];
    setValue("field_positions", updated);
  };

  return (
    <div className="space-y-3">
      <Label>Field Positions *</Label>
      <div className="grid grid-cols-3 gap-3">
        {positionOptions.map((position) => (
          <div key={position.value} className="flex items-center space-x-2">
            <Checkbox
              id={position.value}
              checked={selectedPositions.includes(position.value)}
              onCheckedChange={() => togglePosition(position.value)}
            />
            <Label htmlFor={position.value} className="text-sm font-normal">
              {position.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
