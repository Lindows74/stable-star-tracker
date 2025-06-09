
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
  isPro?: boolean;
}

export const TRAIT_INFO: Record<string, TraitInfo> = {
  // Pro Traits - Superior abilities
  "Blazing Hoof": {
    icon: Zap,
    description: "Thoroughbred Trait: Superior Speed across all game modes",
    category: "Speed & Acceleration",
    isPro: true
  },
  "To the Moon": {
    icon: Rocket,
    description: "Selle Français Trait: Superior Jump across all game modes",
    category: "Jumping & Agility",
    isPro: true
  },
  "Fleet Dash": {
    icon: Wind,
    description: "Arabian Trait: Superior Sprint Energy across all game modes",
    category: "Endurance & Stamina",
    isPro: true
  },
  "Flash Ignite": {
    icon: Zap,
    description: "Quarter Horse Trait: Superior Acceleration across all game modes",
    category: "Speed & Acceleration",
    isPro: true
  },
  "Agile Arrow": {
    icon: Target,
    description: "Standardbred Trait: Superior Agility across all game modes",
    category: "Jumping & Agility",
    isPro: true
  },

  // Breed Traits - Improved abilities
  "Quick Gallop": {
    icon: Gauge,
    description: "Extends preference range to include 800m and 900m",
    category: "Distance Specialization"
  },
  "Swift Trot": {
    icon: Wind,
    description: "Extends preference range to include 1,000m, 1,100m, and 1,200m",
    category: "Distance Specialization"
  },
  "Steady Strider": {
    icon: Footprints,
    description: "Extends distance preference range to include 1,400m to 1,600m",
    category: "Distance Specialization"
  },
  "Meadow Runner": {
    icon: Trees,
    description: "Extends preference range to include 1,800m, 2,000m, and 2,200m",
    category: "Distance Specialization"
  },
  "Endurance Charger": {
    icon: Battery,
    description: "Extends preference range to include 2,400m and 2,600m",
    category: "Endurance & Stamina"
  },
  "Marathon Trotter": {
    icon: Timer,
    description: "Extends preference range to include 2,800m, 3,000m, and 3,200m",
    category: "Endurance & Stamina"
  },

  // Exotic Traits - Special distance preferences
  "Short Star": {
    icon: Star,
    description: "Extends preference range to include 800m and below",
    category: "Distance Specialization"
  },
  "Mid Miracle": {
    icon: Star,
    description: "Extends distance preference range to include 1,400m to 2,200m",
    category: "Distance Specialization"
  },
  "Marathon Master": {
    icon: Star,
    description: "Extends distance preference range to include 2,400m and higher",
    category: "Distance Specialization"
  },
  "Thundering Hooves": {
    icon: Zap,
    description: "Starts with full stamina bar. Extends preference range to include 2,600m and 2,800m",
    category: "Endurance & Stamina"
  },
  "Hard N' Fast": {
    icon: Mountain,
    description: "Faster stamina refill rate during final stretch. Extends preference range to include hard and very hard surfaces",
    category: "Terrain & Surface"
  },
  "Meadowstride": {
    icon: Trees,
    description: "Horse is not slowed down by water in Cross Country. Increased speed boost when performing jumps in Cross Country",
    category: "Terrain & Surface"
  },
  "Leaping Lancer": {
    icon: Mountain,
    description: "Max Jump streak in Steeplechase is increased by 1. Improved boost when you perform a perfect jump in Steeplechase",
    category: "Jumping & Agility"
  },

  // Standard Traits
  "Swampy Strider": {
    icon: Waves,
    description: "Extends preference range to include soft and very soft surfaces",
    category: "Terrain & Surface"
  },
  "Mid Dash": {
    icon: Target,
    description: "Extends preference range to include firm and medium surfaces",
    category: "Terrain & Surface"
  },
  "Granite Gallop": {
    icon: Mountain,
    description: "Extends preference range to include hard and very hard surfaces",
    category: "Terrain & Surface"
  },
  "Energy Saver": {
    icon: Battery,
    description: "Slow Races only cost 1 career energy",
    category: "Special Abilities"
  },
  "Lightning Bolt": {
    icon: Zap,
    description: "Faster stamina refill rate in Flat Racing during final stretch",
    category: "Speed & Acceleration"
  },
  "Top Endurance": {
    icon: Battery,
    description: "Start with more Sprint Energy in Flat Racing",
    category: "Endurance & Stamina"
  },
  "Fast Draw": {
    icon: Gauge,
    description: "Increased Speed boost during jumps in Cross Country",
    category: "Speed & Acceleration"
  },
  "River Rider": {
    icon: Waves,
    description: "Horse is not slowed down by water in Cross Country",
    category: "Terrain & Surface"
  },
  "Perfect Step": {
    icon: Footprints,
    description: "Improved boost when you perform a perfect jump in Steeplechase",
    category: "Jumping & Agility"
  },
  "Leaping Star": {
    icon: Star,
    description: "Max Jump streak in Steeplechase is increased by 1",
    category: "Jumping & Agility"
  },

  // Star Club Traits - Special abilities
  "Thrifty Spender": {
    icon: DollarSign,
    description: "Reduced entry fee in Live Events",
    category: "Special Abilities"
  },
  "Elite Lineage": {
    icon: Crown,
    description: "Foals born from this horse have +1 to all Base Stats except for A+",
    category: "Special Abilities"
  },
  "Top Student": {
    icon: GraduationCap,
    description: "All foals bred from this horse have 20% of their possible XP but still require training",
    category: "Special Abilities"
  }
};

export const getTraitInfo = (traitName: string): TraitInfo | null => {
  return TRAIT_INFO[traitName] || null;
};
