// Live races for 2025 based on official Rival Stars Horse Racing schedule
// Source: https://rivalstarshorseracing.com/2024/09/12/race-list/

export interface LiveRace {
  distance: number;
  surface: string;
  category: string;
  grades: string;
  active: boolean;
}

export const LIVE_RACES_2025: LiveRace[] = [
  // Flat Racing
  { distance: 800, surface: "very_soft", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 900, surface: "firm", category: "Flat Racing", grades: "Even", active: true },
  { distance: 1000, surface: "hard", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 1200, surface: "medium", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 1200, surface: "very_soft", category: "Flat Racing", grades: "Even", active: true },
  { distance: 1400, surface: "medium", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 1600, surface: "firm", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 1600, surface: "hard", category: "Flat Racing", grades: "Even", active: true },
  { distance: 1600, surface: "very_hard", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 1800, surface: "very_hard", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 2000, surface: "hard", category: "Flat Racing", grades: "Even", active: true },
  { distance: 2000, surface: "soft", category: "Flat Racing", grades: "Even", active: true },
  { distance: 2400, surface: "firm", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 2800, surface: "very_hard", category: "Flat Racing", grades: "Odd", active: true },
  { distance: 3000, surface: "hard", category: "Flat Racing", grades: "Even", active: true },
  { distance: 3200, surface: "soft", category: "Flat Racing", grades: "Even", active: true },
  { distance: 3200, surface: "very_hard", category: "Flat Racing", grades: "Odd", active: true },
  
  // Steeplechase
  { distance: 900, surface: "very_hard", category: "Steeplechase", grades: "Odd", active: true },
  { distance: 1100, surface: "very_hard", category: "Steeplechase", grades: "Even", active: false }, // Out of rotation
  { distance: 1400, surface: "firm", category: "Steeplechase", grades: "Even", active: true }, // Special Event
  
  // Cross Country - Note: Cross Country has 3 races with Very Hard and Very Soft preferences
  // Since specific distances aren't listed, we'll use general surface matching
];

export interface HorseRaceMatch {
  distance: number;
  surface: string;
  category: string;
  grades: string;
}

export const checkHorseLiveRaceMatches = (
  horseDistances: string[] = [],
  horseSurfaces: string[] = [],
  horseCategories: string[] = [],
  horseTier?: number
): HorseRaceMatch[] => {
  const matches: HorseRaceMatch[] = [];
  
  // Convert horse distances to numbers for comparison
  const distanceNumbers = horseDistances.map(d => parseInt(d)).filter(d => !isNaN(d));
  
  // Helper: validate race vs tier when race has grade restriction
  const isTierAllowedForRace = (raceGrades: string, tier?: number) => {
    const grades = raceGrades?.toLowerCase();
    if (!grades || grades === 'all') return true;
    if (typeof tier !== 'number') return false; // if restricted race and tier unknown -> not allowed
    if (grades === 'odd') return [3, 5, 7, 9].includes(tier);
    if (grades === 'even') return [2, 4, 6, 8].includes(tier);
    return true;
  };
  
  // Check Flat Racing and Steeplechase matches
  for (const race of LIVE_RACES_2025) {
    if (!race.active) continue;
    
    const hasMatchingDistance = distanceNumbers.includes(race.distance);
    const hasMatchingSurface = horseSurfaces.includes(race.surface);
    const hasMatchingCategory = horseCategories.length === 0 || 
      horseCategories.some(cat => cat.toLowerCase().includes(race.category.toLowerCase().replace(' ', '_')));
    const tierOk = isTierAllowedForRace(race.grades, horseTier);
    
    if (hasMatchingDistance && hasMatchingSurface && tierOk) {
      matches.push({
        distance: race.distance,
        surface: race.surface,
        category: race.category,
        grades: race.grades
      });
    }
  }
  
  // Special handling for Cross Country - check if horse has very_hard or very_soft surfaces
  const hasXCCompatibleSurface = horseSurfaces.some(surface => 
    surface === 'very_hard' || surface === 'very_soft'
  );
  const hasXCCategory = horseCategories.length === 0 || 
    horseCategories.some(cat => cat.toLowerCase().includes('cross_country'));
    
  if (hasXCCompatibleSurface) {
    // Add Cross Country matches for compatible surfaces
    const compatibleSurfaces = horseSurfaces.filter(surface => 
      surface === 'very_hard' || surface === 'very_soft'
    );
    
    for (const surface of compatibleSurfaces) {
      matches.push({
        distance: 0, // Cross Country doesn't specify distance
        surface: surface,
        category: "Cross Country",
        grades: "All"
      });
    }
  }
  
  return matches;
};

export const formatSurfaceName = (surface: string): string => {
  return surface.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};