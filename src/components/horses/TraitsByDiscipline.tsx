import { Badge } from "@/components/ui/badge";
import { TraitBadge } from "./TraitBadge";

interface TraitsByDisciplineProps {
  traits: Array<{ trait_name: string; trait_value?: string }>;
  allTraitNames: string[];
}

// Trait categorization based on official guide
const TRAIT_CATEGORIES = {
  universal: [
    "Blazing Hoof", "Blazing Hoof Pro",
    "Fleet Dash", "Fleet Dash Pro", 
    "Agile Arrow", "Agile Arrow Pro",
    "Flash Ignite", "Flash Ignite Pro",
    "To The Moon", "To The Moon Pro"
  ],
  flatRacing: [
    "Endless Stride", "Endless Stride Pro",
    "Lightning Bolt",
    "Top Endurance", 
    "Steam Burst",
    "Hard N' Fast",
    "Thundering Hooves"
  ],
  steeplechase: [
    "Streak Shield", "Streak Shield Pro",
    "Leaping Star",
    "Perfect Step",
    "Leaping Lancer", 
    "Kinetic Boost"
  ],
  crossCountry: [
    "River Rider",
    "Fast Draw",
    "Meadowstride"
  ],
  multiDiscipline: [
    "Rolling Current", "Rolling Current Pro"
  ],
  surfacePreference: [
    "Granite Gallop",
    "Mid Dash", 
    "Swampy Strider"
  ],
  distancePreference: [
    "Quick Gallop",
    "Swift Trot",
    "Steady Strider", 
    "Meadow Runner",
    "Endurance Charger",
    "Marathon Trotter",
    "Short Star",
    "Mid Miracle", 
    "Marathon Master"
  ],
  special: [
    "Energy Saver",
    "Thrifty Spender",
    "Elite Lineage",
    "Top Student",
    "Majestic Mane",
    "Crystal Coat",
    "Noble Braid"
  ]
};

const CATEGORY_LABELS = {
  universal: "🌟 All Disciplines",
  flatRacing: "🏁 Flat Racing",
  steeplechase: "🦘 Steeplechase", 
  crossCountry: "🌄 Cross Country",
  multiDiscipline: "🎯 Multi-Discipline",
  surfacePreference: "🌍 Surface Preference",
  distancePreference: "📏 Distance Preference",
  special: "✨ Special"
};

const categorizeTraits = (traits: Array<{ trait_name: string; trait_value?: string }>) => {
  const categorized: Record<string, Array<{ trait_name: string; trait_value?: string }>> = {};
  
  traits.forEach(trait => {
    let category = 'special'; // default category
    
    for (const [cat, traitList] of Object.entries(TRAIT_CATEGORIES)) {
      if (traitList.includes(trait.trait_name)) {
        category = cat;
        break;
      }
    }
    
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(trait);
  });
  
  return categorized;
};

export const TraitsByDiscipline = ({ traits, allTraitNames }: TraitsByDisciplineProps) => {
  if (!traits || traits.length === 0) {
    return null;
  }

  const categorizedTraits = categorizeTraits(traits);
  
  // Order categories by importance
  const categoryOrder = [
    'universal',
    'flatRacing', 
    'steeplechase',
    'crossCountry',
    'multiDiscipline',
    'surfacePreference',
    'distancePreference',
    'special'
  ];

  return (
    <div className="space-y-3">
      {categoryOrder.map(category => {
        const categoryTraits = categorizedTraits[category];
        if (!categoryTraits || categoryTraits.length === 0) return null;
        
        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                ({categoryTraits.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {categoryTraits.map((trait, idx) => (
                <TraitBadge 
                  key={`${category}-${idx}`}
                  traitName={trait.trait_name}
                  allTraits={allTraitNames}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};