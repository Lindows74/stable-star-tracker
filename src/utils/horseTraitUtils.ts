// Define which traits can stack together
const SPEED_STACKING_TRAITS = [
  ["Lightning Bolt", "Hard 'N' Fast"], // Faster stamina refill during final stretch
  ["Lightning Bolt", "Hard n´Fast"], // Handle both apostrophe variations
];

const JUMPING_STACKING_TRAITS = [
  ["Leaping Star", "Leaping Lancer"], // Enhanced jump streak in Steeplechase
  ["Perfect Step", "Leaping Lancer"], // Enhanced boost after perfect jump in Steeplechase
];

const STACKING_TRAIT_GROUPS = [...SPEED_STACKING_TRAITS, ...JUMPING_STACKING_TRAITS];

// Define traits that provide full stamina benefits
const FULL_STAMINA_TRAITS = [
  "Top Endurance", // Start with more Sprint Energy in Flat Racing
  "Thundering Hooves", // Starts with full stamina bar
];

export const checkHorseHasStackingTraits = (horseTraits: string[]): boolean => {
  return STACKING_TRAIT_GROUPS.some(group => {
    // Check if horse has at least 2 traits from the same stacking group
    const traitsInGroup = group.filter(trait => horseTraits.includes(trait));
    return traitsInGroup.length >= 2;
  });
};

export const checkHorseHasSpeedStackingTraits = (horseTraits: string[]): boolean => {
  return SPEED_STACKING_TRAITS.some(group => {
    // Check if horse has at least 2 traits from the same stacking group
    const traitsInGroup = group.filter(trait => horseTraits.includes(trait));
    return traitsInGroup.length >= 2;
  });
};

export const checkHorseHasJumpingStackingTraits = (horseTraits: string[]): boolean => {
  return JUMPING_STACKING_TRAITS.some(group => {
    // Check if horse has at least 2 traits from the same stacking group
    const traitsInGroup = group.filter(trait => horseTraits.includes(trait));
    return traitsInGroup.length >= 2;
  });
};

export const checkHorseHasFullStaminaTrait = (horseTraits: string[]): boolean => {
  return FULL_STAMINA_TRAITS.some(trait => horseTraits.includes(trait));
};

// Mapping of traits to their required breeds for Pro status (based on 80% breeding requirement)
const TRAIT_BREEDING_REQUIREMENTS = {
  "Blazing Hoof": ["Thoroughbred"],
  "Fleet Dash": ["Arabian", "Mustang"],  
  "Agile Arrow": ["KS"],
  "Flash Ignite": ["QH"],
  "To The Moon": ["Selle Francais", "Knabstrupper"],
  "Endless Stride": ["Akhal-Teke"],
  "Rolling Current": ["Anglo-Arab"]
};

// Check if a trait should be displayed as Pro based on breeding percentages
export const checkTraitShouldBePro = (
  traitName: string, 
  horseBreeding: Array<{percentage: number, breeds: {name: string}}>
): boolean => {
  const requiredBreeds = TRAIT_BREEDING_REQUIREMENTS[traitName as keyof typeof TRAIT_BREEDING_REQUIREMENTS];
  
  if (!requiredBreeds || !horseBreeding) return false;
  
  return requiredBreeds.some(requiredBreed => {
    const breedMatch = horseBreeding.find(breeding => 
      breeding.breeds?.name === requiredBreed
    );
    return breedMatch && breedMatch.percentage >= 80;
  });
};

export const getHorseSpecialIcons = (horseTraits: string[]): string => {
  const icons = [];
  
  if (checkHorseHasSpeedStackingTraits(horseTraits)) {
    icons.push('🔥');
  }
  
  if (checkHorseHasJumpingStackingTraits(horseTraits)) {
    icons.push('🐸');
  }
  
  if (checkHorseHasFullStaminaTrait(horseTraits)) {
    icons.push('💯');
  }
  
  return icons.join(' ');
};