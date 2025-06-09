
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MaxTrainingForm } from "./MaxTrainingForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface HorseCardProps {
  horse: Tables<"horses"> & {
    horse_categories?: { category: string }[];
  };
}

export const HorseCard = ({ horse }: HorseCardProps) => {
  const [showMaxTraining, setShowMaxTraining] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category.trim()) {
      case "flat_racing":
        return "bg-blue-100 text-blue-800";
      case "steeplechase":
        return "bg-green-100 text-green-800";
      case "cross_country":
        return "bg-orange-100 text-orange-800";
      case "misc":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: number | null) => {
    if (!tier) return "bg-gray-100 text-gray-800";
    if (tier >= 8) return "bg-purple-100 text-purple-800";
    if (tier >= 6) return "bg-yellow-100 text-yellow-800";
    if (tier >= 4) return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  const formatCategoryName = (category: string) => {
    return category.replace("_", " ").toUpperCase();
  };

  // Get categories from the new horse_categories relationship
  const categories = horse.horse_categories?.map(hc => hc.category) || [];

  const stats = [
    { 
      name: "Speed", 
      value: horse.speed, 
      dietValue: horse.diet_speed, 
      maxed: horse.max_speed || false
    },
    { 
      name: "Sprint Energy", 
      value: horse.sprint_energy, 
      dietValue: horse.diet_sprint_energy, 
      maxed: horse.max_sprint_energy || false
    },
    { 
      name: "Acceleration", 
      value: horse.acceleration, 
      dietValue: horse.diet_acceleration, 
      maxed: horse.max_acceleration || false
    },
    { 
      name: "Agility", 
      value: horse.agility, 
      dietValue: horse.diet_agility, 
      maxed: horse.max_agility || false
    },
    { 
      name: "Jump", 
      value: horse.jump, 
      dietValue: horse.diet_jump, 
      maxed: horse.max_jump || false
    },
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {horse.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {horse.tier && (
              <Badge className={`text-xs ${getTierColor(horse.tier)}`}>
                Tier {horse.tier}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMaxTraining(!showMaxTraining)}
              className="h-6 w-6"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {categories.map((category, index) => (
              <Badge 
                key={index} 
                className={`text-xs ${getCategoryColor(category)}`}
              >
                {formatCategoryName(category)}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Racing Stats</h4>
          {stats.map((stat) => {
            const totalValue = (stat.value || 0) + (stat.dietValue || 0);
            
            return (
              <div key={stat.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{stat.name}</span>
                    {stat.maxed && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-100 text-green-800">
                        MAX
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {totalValue}
                    </span>
                    {stat.dietValue && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        +{stat.dietValue} diet
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress
                  value={(totalValue / 300) * 100}
                  className="h-2"
                />
              </div>
            );
          })}
        </div>

        {showMaxTraining && <MaxTrainingForm horse={horse} />}

        {horse.notes && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 italic">{horse.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
