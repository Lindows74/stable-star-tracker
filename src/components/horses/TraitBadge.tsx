
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
import { Info } from "lucide-react";

interface TraitBadgeProps {
  traitName: string;
}

export const TraitBadge = ({ traitName }: TraitBadgeProps) => {
  const traitInfo = getTraitInfo(traitName);
  const IconComponent = traitInfo?.icon || Info;

  return (
    <TooltipProvider>
      <ContextMenu>
        <ContextMenuTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="secondary"
                className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 cursor-pointer hover:bg-amber-200 transition-colors"
              >
                <IconComponent className="h-3 w-3" />
                {traitName}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Right-click for trait details</p>
            </TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="w-64">
          <ContextMenuItem disabled className="flex-col items-start space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <IconComponent className="h-4 w-4" />
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
