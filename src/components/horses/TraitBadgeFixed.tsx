
import { Badge } from "@/components/ui/badge";
import { 
  Zap, Shield, Heart, Wind, Mountain, Battery, 
  Flame, Star, Crown, Target, ArrowUp, ArrowDown,
  Sparkles, Circle
} from "lucide-react";

interface TraitBadgeProps {
  traitName: string;
}

interface BaseTrait {
  icon: any;
  description: string;
  category: string;
}

interface ProTrait extends BaseTrait {
  isPro: true;
}

type TraitInfo = BaseTrait | ProTrait;

const traitDatabase: Record<string, TraitInfo> = {
  // Speed & Acceleration
  "Lightning Bolt": {
    icon: Zap,
    description: "Faster stamina refill rate in Flat Racing during final stretch",
    category: "Speed & Acceleration"
  },
  "Blazing Hoof": {
    icon: Flame,
    description: "Improved acceleration in the initial phase of races",
    category: "Speed & Acceleration"
  },
  "Blazing Hoof Pro": {
    icon: Flame,
    description: "Enhanced acceleration with longer duration boost",
    category: "Speed & Acceleration",
    isPro: true
  },
  
  // Endurance & Stamina
  "Endurance Charger": {
    icon: Battery,
    description: "Extends preference range to include 2,400m and 2,600m",
    category: "Endurance & Stamina"
  },
  "Fleet Dash": {
    icon: Wind,
    description: "Arabian Trait: Superior Sprint Energy across all game modes",
    category: "Endurance & Stamina",
    isPro: true
  },
  "Energy Saver": {
    icon: Heart,
    description: "Reduces energy consumption during races",
    category: "Endurance & Stamina"
  },
  "Mid Dash": {
    icon: Target,
    description: "Enhanced performance in middle sections of races",
    category: "Endurance & Stamina"
  },
  
  // Terrain & Surface
  "Granite Gallop": {
    icon: Mountain,
    description: "Extends preference range to include hard and very hard surfaces",
    category: "Terrain & Surface"
  },
  
  // Defensive & Protection
  "Shield Wall": {
    icon: Shield,
    description: "Reduces impact from other horses during races",
    category: "Defensive & Protection"
  },
  
  // Elite & Rare
  "Champion's Mark": {
    icon: Crown,
    description: "Rare trait that provides overall performance boost",
    category: "Elite & Rare"
  },
  "Rising Star": {
    icon: Star,
    description: "Improved performance in competitive races",
    category: "Elite & Rare"
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Speed & Acceleration":
      return "bg-red-100 text-red-800 border-red-200";
    case "Endurance & Stamina":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Terrain & Surface":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Defensive & Protection":
      return "bg-green-100 text-green-800 border-green-200";
    case "Elite & Rare":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const TraitBadgeFixed = ({ traitName }: TraitBadgeProps) => {
  const traitInfo = traitDatabase[traitName];
  const isPro = traitInfo && 'isPro' in traitInfo && traitInfo.isPro;
  
  console.log(`TraitBadge for "${traitName}":`, {
    traitInfo,
    isPro,
    colorClass: isPro 
      ? "bg-gradient-to-r from-yellow-300 to-orange-300 text-orange-900 border-2 border-yellow-500 font-bold shadow-lg"
      : getCategoryColor(traitInfo?.category || "")
  });

  // Pro traits get special styling
  if (isPro) {
    const IconComponent = traitInfo.icon;
    return (
      <Badge 
        variant="outline" 
        className="text-xs bg-gradient-to-r from-yellow-300 to-orange-300 text-orange-900 border-2 border-yellow-500 font-bold shadow-lg"
        title={traitInfo.description}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {traitName}
      </Badge>
    );
  }

  // Regular traits
  if (traitInfo) {
    const IconComponent = traitInfo.icon;
    const colorClass = getCategoryColor(traitInfo.category);
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${colorClass}`}
        title={traitInfo.description}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {traitName}
      </Badge>
    );
  }

  // Unknown trait fallback
  return (
    <Badge 
      variant="outline" 
      className="text-xs bg-gray-100 text-gray-800 border-gray-200"
      title="Unknown trait"
    >
      <Circle className="w-3 h-3 mr-1" />
      {traitName}
    </Badge>
  );
};
