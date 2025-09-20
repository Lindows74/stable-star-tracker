// Define which traits can stack together
const SPEED_STACKING_TRAITS = [
  ["Lightning Bolt", "Hard 'N' Fast"], // Faster stamina refill during final stretch
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