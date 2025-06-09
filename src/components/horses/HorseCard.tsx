
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { TraitBadge } from "./TraitBadge";
import { useState } from "react";
import { HorseEditForm } from "./HorseEditForm";

interface HorseCardProps {
  horse: any;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "flat_racing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "steeplechase":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "cross_country":
      return "bg-green-100 text-green-800 border-green-200";
    case "misc":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const HorseCard = ({ horse }: HorseCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <HorseEditForm 
        horse={horse} 
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Calculate total stats (base + diet bonus)
  const totalSpeed = (horse.speed || 0) + (horse.diet_speed || 0);
  const totalSprintEnergy = (horse.sprint_energy || 0) + (horse.diet_sprint_energy || 0);
  const totalAcceleration = (horse.acceleration || 0) + (horse.diet_acceleration || 0);
  const totalAgility = (horse.agility || 0) + (horse.diet_agility || 0);
  const totalJump = (horse.jump || 0) + (horse.diet_jump || 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{horse.name}</span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-6">
          {/* Basic Stats with Diet Plans */}
          <div className="flex-1 min-w-48">
            {horse.tier && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Tier:</span>
                <Badge variant="secondary">{horse.tier}</Badge>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-1 text-sm">
              {horse.speed !== null && horse.speed !== undefined && (
                <div>
                  Speed: {totalSpeed}
                  {horse.diet_speed && <span className="text-green-600"> (+{horse.diet_speed})</span>}
                </div>
              )}
              {horse.sprint_energy !== null && horse.sprint_energy !== undefined && (
                <div>
                  Sprint Energy: {totalSprintEnergy}
                  {horse.diet_sprint_energy && <span className="text-green-600"> (+{horse.diet_sprint_energy})</span>}
                </div>
              )}
              {horse.acceleration !== null && horse.acceleration !== undefined && (
                <div>
                  Acceleration: {totalAcceleration}
                  {horse.diet_acceleration && <span className="text-green-600"> (+{horse.diet_acceleration})</span>}
                </div>
              )}
              {horse.agility !== null && horse.agility !== undefined && (
                <div>
                  Agility: {totalAgility}
                  {horse.diet_agility && <span className="text-green-600"> (+{horse.diet_agility})</span>}
                </div>
              )}
              {horse.jump !== null && horse.jump !== undefined && (
                <div>
                  Jump: {totalJump}
                  {horse.diet_jump && <span className="text-green-600"> (+{horse.diet_jump})</span>}
                </div>
              )}
            </div>
          </div>

          {/* Max Training */}
          {(horse.max_speed || horse.max_sprint_energy || horse.max_acceleration || horse.max_agility || horse.max_jump) && (
            <div className="flex-1 min-w-48">
              <span className="text-sm font-medium text-blue-700">Max Training:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {horse.max_speed && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Speed</Badge>}
                {horse.max_sprint_energy && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Sprint Energy</Badge>}
                {horse.max_acceleration && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Acceleration</Badge>}
                {horse.max_agility && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Agility</Badge>}
                {horse.max_jump && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Jump</Badge>}
              </div>
            </div>
          )}
        </div>

        {/* Categories, Traits, Breeding, etc. */}
        <div className="mt-4 space-y-2">
          {horse.horse_categories && horse.horse_categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Categories:</span>
              {horse.horse_categories.map((cat: any, index: number) => (
                <Badge key={index} variant="outline" className={`text-xs ${getCategoryColor(cat.category)}`}>
                  {cat.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          )}

          {horse.horse_traits && horse.horse_traits.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Traits:</span>
              {horse.horse_traits.map((trait: any, index: number) => (
                <TraitBadge key={index} traitName={trait.trait_name} />
              ))}
            </div>
          )}

          {horse.horse_breeding && horse.horse_breeding.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Breeding:</span>
              {horse.horse_breeding.map((breeding: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-purple-100 text-purple-800">
                  {breeding.breeds?.name} ({breeding.percentage}%)
                </Badge>
              ))}
            </div>
          )}

          {horse.horse_surfaces && horse.horse_surfaces.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Surfaces:</span>
              {horse.horse_surfaces.map((surface: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                  {surface.surface}
                </Badge>
              ))}
            </div>
          )}

          {horse.horse_distances && horse.horse_distances.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Distances:</span>
              {horse.horse_distances.map((distance: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-orange-100 text-orange-800">
                  {distance.distance}m
                </Badge>
              ))}
            </div>
          )}

          {horse.horse_positions && horse.horse_positions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Positions:</span>
              {horse.horse_positions.map((position: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-100 text-gray-800">
                  {position.position}
                </Badge>
              ))}
            </div>
          )}

          {horse.notes && (
            <div>
              <span className="text-sm font-medium">Notes:</span>
              <p className="text-sm text-gray-600 mt-1">{horse.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
