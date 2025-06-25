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
  LucideIcon,
  ArrowUp,
  Shield,
  Circle
} from "lucide-react";

interface TraitInfo {
  icon: LucideIcon;
  description: string;
  category: string;
  isPro?: boolean;
}

export const TRAIT_INFO: Record<string, TraitInfo> = {
  // Pro Traits - Superior abilities (from Pro Traits image)
  "Blazing Hoof Pro": {
    icon: Zap,
    description: "Superior Speed across all game modes",
    category: "Speed & Acceleration",
    isPro: true
  },
  "Fleet Dash Pro": {
    icon: Wind,
    description: "Superior Sprint Energy across all game modes",
    category: "Endurance & Stamina",
    isPro: true
  },
  "Agile Arrow Pro": {
    icon: Target,
    description: "Superior Agility across all game modes",
    category: "Jumping & Agility",
    isPro: true
  },
  "Flash Ignite Pro": {
    icon: Zap,
    description: "Superior Acceleration across all game modes",
    category: "Speed & Acceleration",
    isPro: true
  },
  "To The Moon Pro": {
    icon: Rocket,
    description: "Superior Jump across all game modes",
    category: "Jumping & Agility",
    isPro: true
  },
  "Endless Stride Pro": {
    icon: Battery,
    description: "On Flat Racing tracks of 2400m or more, gain superior acceleration and Sprint Energy lasts longer",
    category: "Endurance & Stamina",
    isPro: true
  },
  "Rolling Current Pro": {
    icon: Waves,
    description: "On hard surfaces recharge extra Sprint Energy when jumping and gain improved Acceleration in Cross Country races. Turns Pro if horse is 80% or higher Akhal Teke",
    category: "Terrain & Surface",
    isPro: true
  },

  // General Traits (from General Traits image)
  "Blazing Hoof": {
    icon: Zap,
    description: "Improved Speed across all game modes. Turns Pro if the horse is 80% Thoroughbred",
    category: "Speed & Acceleration"
  },
  "Fleet Dash": {
    icon: Wind,
    description: "Improved Sprint Energy across all game modes. Turns Pro if the horse is 80% Arabian or Mustang",
    category: "Endurance & Stamina"
  },
  "Agile Arrow": {
    icon: Target,
    description: "Improved Agility across all game modes. Turns Pro if the horse is 80% KS",
    category: "Jumping & Agility"
  },
  "Flash Ignite": {
    icon: Zap,
    description: "Improved Acceleration across all game modes. Turns Pro if the horse is 80% QH",
    category: "Speed & Acceleration"
  },
  "To The Moon": {
    icon: Rocket,
    description: "Improved Jump across all game modes. Turns Pro if the horse is 80% Selle Francais or Knabstrupper",
    category: "Jumping & Agility"
  },
  "Energy Saver": {
    icon: Battery,
    description: "Slow Races only cost 1 Career Energy",
    category: "Special Abilities"
  },
  "Endless Stride": {
    icon: Battery,
    description: "On Flat Racing tracks of 2400m or more, gains improved acceleration and Sprint Energy lasts longer. Turns Pro if horse is 80% or higher Akhal Teke",
    category: "Endurance & Stamina"
  },
  "Rolling Current": {
    icon: Waves,
    description: "On hard surfaces recharge extra Sprint Energy when jumping and gain improved Acceleration in Cross Country races. Turns Pro if horse is 80% or higher Akhal Teke",
    category: "Terrain & Surface"
  },

  // Distance Preference Traits (from Distance Preference Traits image)
  "Quick Gallop": {
    icon: Gauge,
    description: "Extends preference to 800m and 900m",
    category: "Distance Specialization"
  },
  "Swift Trot": {
    icon: Wind,
    description: "Extends preference to 1,000m, 1,100m, and 1,200m",
    category: "Distance Specialization"
  },
  "Steady Strider": {
    icon: Footprints,
    description: "Extends preference to 1,400m and 1,600m",
    category: "Distance Specialization"
  },
  "Meadow Runner": {
    icon: Trees,
    description: "Extends preference to 1,800m, 2,000m, and 2, 200m",
    category: "Distance Specialization"
  },
  "Endurance Charger": {
    icon: Battery,
    description: "Extends preference to 2,400m and 2,600m",
    category: "Distance Specialization"
  },
  "Marathon Trotter": {
    icon: Timer,
    description: "Extends preference to 2,800m, 3,000m, and 3,200m",
    category: "Distance Specialization"
  },

  // Surface Preference Traits (from Surface Preference Traits image)
  "Granite Gallop": {
    icon: Mountain,
    description: "Extends preference to hard and very hard surfaces",
    category: "Terrain & Surface"
  },
  "Mid Dash": {
    icon: Target,
    description: "Extends preference to firm and medium surfaces",
    category: "Terrain & Surface"
  },
  "Swampy Strider": {
    icon: Waves,
    description: "Extends preference to soft and very soft surfaces",
    category: "Terrain & Surface"
  },

  // Game Mode Specific Traits (from Specific Game Mode Traits image)
  "Lightning Bolt": {
    icon: Zap,
    description: "Faster stamina refill rate during the final stretch in Flat Racing. Lightning Bolt can stack with Fleet Dash for even faster stamina refill during the final stretch of a race",
    category: "Speed & Acceleration"
  },
  "Top Endurance": {
    icon: Battery,
    description: "Start with more Sprint Energy in Flat Racing",
    category: "Endurance & Stamina"
  },
  "Leaping Star": {
    icon: Star,
    description: "Max jump streak in Steeplechase. Leaping Star can stack with Leaping Lancer to get an even further increased jump streak in Steeplechase",
    category: "Jumping & Agility"
  },
  "Perfect Step": {
    icon: Footprints,
    description: "Improved boost after a perfect jump in Steeplechase. Perfect Step can stack with Leaping Lancer to get an even greater improved boost after a perfect jump in Steeplechase",
    category: "Jumping & Agility"
  },
  "River Rider": {
    icon: Waves,
    description: "Horse is not slowed by water in Cross Country",
    category: "Terrain & Surface"
  },
  "Fast Draw": {
    icon: Gauge,
    description: "Increased speed boost during jumps in Cross Country",
    category: "Speed & Acceleration"
  },
  "Revitalizing Surge": {
    icon: Battery,
    description: "Recover 20% stamina the first time you deplete all stamina in Cross Country",
    category: "Endurance & Stamina"
  },
  "Steam Burst": {
    icon: Zap,
    description: "On flat racing tracks between 800-1200m, sprinting increases acceleration and maximum top speed but uses more Sprint Energy",
    category: "Speed & Acceleration"
  },

  // Castle Traits (from Castle Traits image)
  "Hefty Shoulder": {
    icon: Shield,
    description: "Reduced chance to trip in Live Events",
    category: "Special Abilities"
  },
  "Firm Lineage": {
    icon: Crown,
    description: "Trails born from this horse have 25% of their Base Stats except for A+",
    category: "Special Abilities"
  },
  "Top Student": {
    icon: GraduationCap,
    description: "All foals bred from this horse have 20% of their possible XP but still require training",
    category: "Special Abilities"
  },

  // Exotic Traits (from Exotic Traits image - based on orange color coding)
  "Saxon Burst": {
    icon: Zap,
    description: "Can Fire Ignite traits activate before and outside, and cannot activate after 80% race completion",
    category: "Speed & Acceleration"
  },
  "Saxon Soul": {
    icon: Wind,
    description: "Extremely calming mind can include 1,000x and above",
    category: "Endurance & Stamina"
  },
  "Mid Miracle": {
    icon: Target,
    description: "Extremely calming mind can include 1,400m and above",
    category: "Distance Specialization"
  },
  "Marathon Master": {
    icon: Timer,
    description: "Extremely calming mind can include 2,400m and higher",
    category: "Distance Specialization"
  },
  "Thundering Hooves": {
    icon: Zap,
    description: "Starts with full stamina bar. Extends performance to include 2,600m and 2,800m",
    category: "Endurance & Stamina"
  },
  "Hard N' Fast": {
    icon: Mountain,
    description: "Faster stamina refill rate during final stretch. Extends performance to include 2,400m and higher",
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
  "Majestic Mane": {
    icon: Crown,
    description: "The horse will have a magnificent presence and enhanced agility",
    category: "Jumping & Agility"
  },
  "Crystal Coat": {
    icon: Star,
    description: "A beautiful coat reveals your horse's soul like no other",
    category: "Special Abilities"
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

  // Additional Distance Traits
  "Short Star": {
    icon: Star,
    description: "Extends preference range to include 800m and below",
    category: "Distance Specialization"
  }
};

export const getTraitInfo = (traitName: string): TraitInfo | null => {
  return TRAIT_INFO[traitName] || null;
};
