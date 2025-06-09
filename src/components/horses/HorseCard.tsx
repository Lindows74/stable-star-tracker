
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface HorseCardProps {
  horse: any;
}

export const HorseCard = ({ horse }: HorseCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{horse.name}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {horse.tier && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Tier:</span>
              <Badge variant="secondary">{horse.tier}</Badge>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            {horse.speed && <div>Speed: {horse.speed}</div>}
            {horse.sprint_energy && <div>Sprint: {horse.sprint_energy}</div>}
            {horse.acceleration && <div>Accel: {horse.acceleration}</div>}
            {horse.agility && <div>Agility: {horse.agility}</div>}
            {horse.jump && <div>Jump: {horse.jump}</div>}
          </div>

          {horse.horse_categories && horse.horse_categories.length > 0 && (
            <div>
              <span className="text-sm font-medium">Categories:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {horse.horse_categories.map((cat: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cat.category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
