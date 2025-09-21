
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
import { checkTraitShouldBePro } from "@/utils/horseTraitUtils";

interface TraitBadgeProps {
  traitName: string;
  allTraits?: string[];
  horseBreeding?: Array<{percentage: number, breeds: {name: string}}>;
}

// Define which traits can stack together
const STACKING_TRAIT_GROUPS = [
  ["Lightning Bolt", "Hard 'N' Fast", "Hard N' Fast", "Hard n´Fast"], // Faster stamina refill during final stretch (handle apostrophe variants)
  ["Leaping Star", "Leaping Lancer"], // Enhanced jump streak in Steeplechase
  ["Perfect Step", "Leaping Lancer"], // Enhanced boost after perfect jump in Steeplechase
];

// Define traits that provide full stamina benefits
const FULL_STAMINA_TRAITS = [
  "Top Endurance", // Start with more Sprint Energy in Flat Racing
  "Thundering Hooves", // Starts with full stamina bar
];

// Define exotic traits that should have special gold border styling
const EXOTIC_TRAITS = [
  "Steam Burst",
  "Short Star", 
  "Mid Miracle",
  "Marathon Master",
  "Thundering Hooves",
  "Hard 'N' Fast",
  "Meadowstride",
  "Leaping Lancer",
  "Majestic Mane",
  "Crystal Coat",
  "Noble Braid",
  "Kinetic Boost"
];

const getTraitCategoryColor = (category: string, isPro?: boolean, isStacking?: boolean, isExotic?: boolean) => {
  // Red background for stacking traits
  if (isStacking) {
    return "bg-red-600 text-white border-red-700 font-bold shadow-lg";
  }
  
  if (isPro) {
    return "bg-gradient-to-r from-yellow-300 to-orange-300 text-orange-900 border-2 border-yellow-500 font-bold shadow-lg";
  }

  // Gold border for exotic traits
  if (isExotic) {
    return "bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-900 border-4 border-amber-400 font-bold shadow-lg ring-2 ring-amber-300";
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

const checkIfTraitStacks = (traitName: string, allTraits: string[] = []): boolean => {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/['´`]/g, "'").replace(/\s+/g, ' ').trim().replace("hard n' fast", "hard 'n' fast");
  
  const normalizedTraitName = normalize(traitName);
  const normalizedAllTraits = new Set(allTraits.map(normalize));
  
  return STACKING_TRAIT_GROUPS.some(group => {
    const normalizedGroup = group.map(normalize);
    // Check if current trait is in this group and at least one other trait from the same group exists
    if (normalizedGroup.includes(normalizedTraitName)) {
      const otherTraitsInGroup = normalizedGroup.filter(t => t !== normalizedTraitName);
      return otherTraitsInGroup.some(otherTrait => normalizedAllTraits.has(otherTrait));
    }
    return false;
  });
};

export const TraitBadge = ({ traitName, allTraits = [], horseBreeding }: TraitBadgeProps) => {
  const traitInfo = getTraitInfo(traitName);
  const isStacking = checkIfTraitStacks(traitName, allTraits);
  const isExotic = EXOTIC_TRAITS.includes(traitName);
  
  // Check if trait should be Pro based on breeding percentage
  const shouldBePro = horseBreeding ? checkTraitShouldBePro(traitName, horseBreeding) : false;
  const isPro = traitInfo?.isPro || shouldBePro;
  
  const colorClass = isStacking ? "bg-red-600 text-white border-red-700 font-bold shadow-lg" : 
    (traitInfo ? getTraitCategoryColor(traitInfo.category, isPro, isStacking, isExotic) : "bg-gray-100 text-gray-800 border-gray-200");

  console.log(`TraitBadge for "${traitName}":`, {
    traitInfo,
    isPro,
    shouldBePro,
    isStacking,
    allTraits,
    horseBreeding,
    colorClass
  });

  return (
    <TooltipProvider delayDuration={300}>
      <ContextMenu>
        <ContextMenuTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Badge 
                  variant="secondary"
                  className={`flex items-center gap-1 text-xs border cursor-pointer hover:opacity-80 transition-colors ${colorClass}`}
                >
                  {isPro && <span className="text-xs font-bold">⭐</span>}
                  {traitName}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs z-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-medium">
                  {isStacking && <span className="text-red-600 font-bold">🔥 STACKING</span>}
                  {isPro && <span className="text-yellow-600 font-bold">⭐ PRO</span>}
                  {isExotic && <span className="text-amber-600 font-bold">💎 EXOTIC</span>}
                  <span>{traitName}</span>
                </div>
                {traitInfo && (
                  <>
                    <div className="text-xs text-muted-foreground">
                      Category: {traitInfo.category}
                    </div>
                    <div className="text-xs">
                      {traitInfo.description}
                    </div>
                    {isStacking && (
                      <div className="text-xs text-red-600 font-medium">
                        This trait stacks with other compatible traits for enhanced effects!
                      </div>
                    )}
                  </>
                )}
                {!traitInfo && (
                  <div className="text-xs text-muted-foreground">
                    Unknown trait - no information available
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1 pt-1 border-t">
                  Right-click for more options
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="w-64">
          <ContextMenuItem disabled className="flex-col items-start space-y-1">
            <div className="flex items-center gap-2 font-medium">
              {isStacking && <span className="text-red-600 font-bold">🔥 STACKING</span>}
              {isPro && <span className="text-yellow-600 font-bold">⭐ PRO</span>}
              {isExotic && <span className="text-amber-600 font-bold">💎 EXOTIC</span>}
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
                {isStacking && (
                  <div className="text-xs text-red-600 font-medium">
                    This trait stacks with other compatible traits for enhanced effects!
                  </div>
                )}
              </>
            )}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </TooltipProvider>
  );
};
