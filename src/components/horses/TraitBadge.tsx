
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

export const TraitBadge = ({ traitName }: TraitBadgeProps) => {
  const traitInfo = getTraitInfo(traitName);

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
