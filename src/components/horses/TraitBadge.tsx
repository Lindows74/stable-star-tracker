
import { Badge } from "@/components/ui/badge";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTraitInfo } from "./TraitInfo";

interface TraitBadgeProps {
  traitName: string;
}

const getTraitCategoryColor = (category: string, isPro?: boolean) => {
  if (isPro) {
    return "bg-gradient-to-r from-yellow-300 to-orange-300 text-orange-900 border-2 border-yellow-500 font-bold shadow-lg";
  }
  
  switch (category) {
    case "Speed & Acceleration":
      return "bg-red-100 text-red-800 border-red-200";
    case "Endurance & Stamina":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Distance Specialization":
      return "bg-green-100 text-green-800 border-green-200";
    case "Terrain & Surface":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Jumping & Agility":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Special Abilities":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const TraitBadge = ({ traitName }: TraitBadgeProps) => {
  const traitInfo = getTraitInfo(traitName);
  const colorClass = traitInfo ? getTraitCategoryColor(traitInfo.category, traitInfo.isPro) : "bg-gray-100 text-gray-800 border-gray-200";

  console.log(`TraitBadge for "${traitName}":`, {
    traitInfo,
    isPro: traitInfo?.isPro,
    colorClass
  });

  return (
    <TooltipProvider>
      <ContextMenu>
        <ContextMenuTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="secondary"
                className={`flex items-center gap-1 text-xs border cursor-pointer hover:opacity-80 transition-colors ${colorClass}`}
              >
                {traitInfo?.isPro && <span className="text-xs font-bold">⭐</span>}
                {traitName}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {traitInfo?.isPro ? "PRO TRAIT - " : ""}Right-click for trait details
              </p>
            </TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="w-64">
          <ContextMenuItem disabled className="flex-col items-start space-y-1">
            <div className="flex items-center gap-2 font-medium">
              {traitInfo?.isPro && <span className="text-yellow-600 font-bold">⭐ PRO</span>}
              {traitName}
            </div>
            {traitInfo && (
              <>
                <div className="text-xs text-muted-foreground">
                  Category: {traitInfo.category}
                </div>
                <div className="text-xs">
                  {traitInfo.description}
                </div>
              </>
            )}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </TooltipProvider>
  );
};
