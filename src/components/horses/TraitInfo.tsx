
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Gauge, 
  Wind, 
  Timer, 
  Battery, 
  Target, 
  MapPin, 
  Mountain, 
  Waves, 
  Trees, 
  Footprints, 
  Star, 
  Crown, 
  DollarSign, 
  Rocket, 
  GraduationCap,
  LucideIcon
} from "lucide-react";

interface TraitInfo {
  icon: LucideIcon;
  description: string;
  category: string;
}

export const TRAIT_INFO: Record<string, TraitInfo> = {
  // Speed & Acceleration
  "Agile Arrow": {
    icon: Target,
    description: "Increases agility and quick directional changes",
    category: "Speed & Acceleration"
  },
  "Blazing Hoof": {
    icon: Zap,
    description: "Boosts top speed and acceleration",
    category: "Speed & Acceleration"
  },
  "Fast Draw": {
    icon: Gauge,
    description: "Improves initial acceleration from start",
    category: "Speed & Acceleration"
  },
  "Flash Ignite": {
    icon: Zap,
    description: "Rapid acceleration burst ability",
    category: "Speed & Acceleration"
  },
  "Fleet Dash": {
    icon: Wind,
    description: "Enhanced sprint speed capability",
    category: "Speed & Acceleration"
  },
  "Lightning Bolt": {
    icon: Zap,
    description: "Maximum speed enhancement",
    category: "Speed & Acceleration"
  },
  "Quick Gallop": {
    icon: Gauge,
    description: "Improved galloping speed",
    category: "Speed & Acceleration"
  },
  "Swift Trot": {
    icon: Wind,
    description: "Faster trotting pace",
    category: "Speed & Acceleration"
  },
  "Thundering Hooves": {
    icon: Zap,
    description: "Powerful acceleration and speed",
    category: "Speed & Acceleration"
  },

  // Endurance & Stamina
  "Endurance Charger": {
    icon: Battery,
    description: "Significantly increases stamina capacity",
    category: "Endurance & Stamina"
  },
  "Energy Saver": {
    icon: Battery,
    description: "Reduces energy consumption during races",
    category: "Endurance & Stamina"
  },
  "Marathon Trotter": {
    icon: Timer,
    description: "Excellent stamina for long-distance races",
    category: "Endurance & Stamina"
  },
  "Top Endurance": {
    icon: Battery,
    description: "Maximum endurance capabilities",
    category: "Endurance & Stamina"
  },

  // Distance Specialization
  "Mid Dash": {
    icon: Target,
    description: "Specialized for medium-distance races",
    category: "Distance Specialization"
  },
  "Mid Miracle": {
    icon: Star,
    description: "Exceptional performance in mid-range distances",
    category: "Distance Specialization"
  },
  "Short Star": {
    icon: Star,
    description: "Optimized for short sprint races",
    category: "Distance Specialization"
  },

  // Terrain & Surface
  "Granite Gallop": {
    icon: Mountain,
    description: "Performs well on hard surfaces",
    category: "Terrain & Surface"
  },
  "Hard N' Fast": {
    icon: Mountain,
    description: "Excellent on firm track conditions",
    category: "Terrain & Surface"
  },
  "Meadow Runner": {
    icon: Trees,
    description: "Thrives on grass surfaces",
    category: "Terrain & Surface"
  },
  "Meadowstride": {
    icon: Trees,
    description: "Natural grass track specialist",
    category: "Terrain & Surface"
  },
  "River Rider": {
    icon: Waves,
    description: "Adapted to wet track conditions",
    category: "Terrain & Surface"
  },
  "Steady Strider": {
    icon: Footprints,
    description: "Consistent performance on any surface",
    category: "Terrain & Surface"
  },
  "Swampy Strider": {
    icon: Waves,
    description: "Excels in muddy conditions",
    category: "Terrain & Surface"
  },

  // Jumping & Agility
  "Leaping Lancer": {
    icon: Mountain,
    description: "Superior jumping ability and form",
    category: "Jumping & Agility"
  },
  "Leaping Star": {
    icon: Star,
    description: "Exceptional jumping prowess",
    category: "Jumping & Agility"
  },
  "Perfect Step": {
    icon: Footprints,
    description: "Precise footwork and agility",
    category: "Jumping & Agility"
  },

  // Special Abilities
  "Elite Lineage": {
    icon: Crown,
    description: "Superior breeding provides stat bonuses",
    category: "Special Abilities"
  },
  "Thrifty Spender": {
    icon: DollarSign,
    description: "Reduces training and maintenance costs",
    category: "Special Abilities"
  },
  "To the Moon": {
    icon: Rocket,
    description: "Potential for exceptional performance",
    category: "Special Abilities"
  },
  "Top Student": {
    icon: GraduationCap,
    description: "Learns skills faster during training",
    category: "Special Abilities"
  }
};

export const getTraitInfo = (traitName: string): TraitInfo | null => {
  return TRAIT_INFO[traitName] || null;
};
