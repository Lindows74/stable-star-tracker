
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { TraitBadgeFixed } from "./TraitBadgeFixed";
import { useState } from "react";
import { HorseEditForm } from "./HorseEditForm";

interface HorseCardProps {
  horse: any;
}

const getCategoryColor = (category: string) => {
  console.log('Category received:', category, 'Type:', typeof category);
  const normalizedCategory = category.toLowerCase().replace(/[_\s]/g, '');
  console.log('Normalized category:', normalizedCategory);
  
  switch (normalizedCategory) {
    case "flatracing":
      return { backgroundColor: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' };
    case "steeplechase":
      return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
    case "crosscountry":
      return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
    case "misc":
      return { backgroundColor: '#fefce8', color: '#a16207', borderColor: '#fde68a' };
    case "sprinter":
      return { backgroundColor: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' };
    case "miler":
      return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
    case "classic":
      return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
    case "dirt":
      return { backgroundColor: '#fefce8', color: '#a16207', borderColor: '#fde68a' };
    case "turf":
      return { backgroundColor: '#faf5ff', color: '#7c2d12', borderColor: '#e9d5ff' };
    case "synthetic":
      return { backgroundColor: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa' };
    default:
      console.log('Unknown category, using default:', category);
      return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' };
  }
};

export const HorseCard = ({ horse }: HorseCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  console.log('HorseCard: Rendering card for horse:', horse?.name, 'ID:', horse?.id);
  console.log('HorseCard: Horse distances:', horse?.horse_distances);
  console.log('HorseCard: Horse surfaces:', horse?.horse_surfaces);
  console.log('HorseCard: Horse positions:', horse?.horse_positions);
  console.log('HorseCard: Full horse object:', horse);

  // Safety check
  if (!horse) {
    console.error('HorseCard: No horse data provided');
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <p className="text-red-500">Error: No horse data</p>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <HorseEditForm 
        horse={horse} 
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Calculate total stats (base + diet bonus) with null checks
  const totalSpeed = (horse.speed || 0) + (horse.diet_speed || 0);
  const totalSprintEnergy = (horse.sprint_energy || 0) + (horse.diet_sprint_energy || 0);
  const totalAcceleration = (horse.acceleration || 0) + (horse.diet_acceleration || 0);
  const totalAgility = (horse.agility || 0) + (horse.diet_agility || 0);
  const totalJump = (horse.jump || 0) + (horse.diet_jump || 0);

  // Check if racing preferences exist
  const hasDistances = horse.horse_distances && Array.isArray(horse.horse_distances) && horse.horse_distances.length > 0;
  const hasSurfaces = horse.horse_surfaces && Array.isArray(horse.horse_surfaces) && horse.horse_surfaces.length > 0;
  const hasPositions = horse.horse_positions && Array.isArray(horse.horse_positions) && horse.horse_positions.length > 0;
  const hasRacingPreferences = hasDistances || hasSurfaces || hasPositions;

  console.log('HorseCard: Racing preferences check:', {
    hasDistances,
    hasSurfaces,
    hasPositions,
    hasRacingPreferences,
    distancesData: horse.horse_distances,
    surfacesData: horse.horse_surfaces,
    positionsData: horse.horse_positions
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{horse.name || 'Unnamed Horse'}</span>
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
        </div>

        {/* Racing Preferences Section */}
        {hasRacingPreferences && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm font-semibold text-gray-700 mb-3">Racing Preferences</div>
            <div className="space-y-3">
              {hasDistances && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Preferred Distances:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {horse.horse_distances.map((distance: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                        {distance.distance}m
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {hasSurfaces && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Preferred Surfaces:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {horse.horse_surfaces.map((surface: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        {surface.surface.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {hasPositions && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Preferred Positions:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {horse.horse_positions.map((position: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                        {position.position.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories, Traits, Breeding */}
        <div className="mt-4 space-y-2">
          {horse.horse_categories && horse.horse_categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Categories:</span>
              {horse.horse_categories.map((cat: any, index: number) => {
                const colorStyles = getCategoryColor(cat.category);
                console.log('Applied color styles for', cat.category, ':', colorStyles);
                return (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs border"
                    style={colorStyles}
                  >
                    {cat.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                );
              })}
            </div>
          )}

          {horse.horse_traits && horse.horse_traits.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Traits:</span>
              {horse.horse_traits.map((trait: any, index: number) => (
                <TraitBadgeFixed key={index} traitName={trait.trait_name} />
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

          {horse.notes && (
            <div>
              <span className="text-sm font-medium">Notes:</span>
              <p className="text-sm text-gray-600 mt-1">{horse.notes}</p>
            </div>
          )}
        </div>

        {/* Max Training - moved to bottom */}
        {(horse.max_speed || horse.max_sprint_energy || horse.max_acceleration || horse.max_agility || horse.max_jump) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-700">Max Training Achieved:</span>
            <div className="flex flex-wrap gap-1 mt-2">
              {horse.max_speed && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Speed</Badge>}
              {horse.max_sprint_energy && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Sprint Energy</Badge>}
              {horse.max_acceleration && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Acceleration</Badge>}
              {horse.max_agility && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Agility</Badge>}
              {horse.max_jump && <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">Jump</Badge>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
