
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ValidationError {
  field: string;
  message: string;
}

interface HorseFormValidationProps {
  formData: any;
  onValidationChange: (isValid: boolean, errors: ValidationError[]) => void;
}

export const useHorseFormValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validateForm = (formData: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Required field validations
    if (!formData.name?.trim()) {
      errors.push({ field: "name", message: "Horse name is required" });
    }

    if (!formData.tier || formData.tier < 1 || formData.tier > 10) {
      errors.push({ field: "tier", message: "Tier must be between 1 and 10" });
    }

    // Stat validations
    if (formData.speed === null || formData.speed === undefined || formData.speed < 0) {
      errors.push({ field: "speed", message: "Speed is required and must be 0 or greater" });
    }

    if (formData.sprint_energy === null || formData.sprint_energy === undefined || formData.sprint_energy < 0) {
      errors.push({ field: "sprint_energy", message: "Sprint Energy is required and must be 0 or greater" });
    }

    if (formData.acceleration === null || formData.acceleration === undefined || formData.acceleration < 0) {
      errors.push({ field: "acceleration", message: "Acceleration is required and must be 0 or greater" });
    }

    if (formData.agility === null || formData.agility === undefined || formData.agility < 0) {
      errors.push({ field: "agility", message: "Agility is required and must be 0 or greater" });
    }

    if (formData.jump === null || formData.jump === undefined || formData.jump < 0) {
      errors.push({ field: "jump", message: "Jump is required and must be 0 or greater" });
    }

    // At least one category must be selected
    if (!formData.categories || formData.categories.length === 0) {
      errors.push({ field: "categories", message: "At least one category must be selected" });
    }

    return errors;
  };

  const ValidationErrorDisplay = ({ errors }: { errors: ValidationError[] }) => {
    if (errors.length === 0) return null;

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="font-medium mb-2">Please fix the following errors:</div>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">
                {error.message}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  return {
    validateForm,
    validationErrors,
    setValidationErrors,
    ValidationErrorDisplay
  };
};
