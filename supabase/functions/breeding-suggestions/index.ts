import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching live races and horses data...');

    // Fetch all live races (including inactive ones for display)
    const { data: liveRaces, error: racesError } = await supabase
      .from('live_races')
      .select('*')
      .order('id');

    if (racesError) {
      console.error('Error fetching live races:', racesError);
      throw racesError;
    }

    console.log('Found live races:', liveRaces?.length);

    // Fetch all horses (no user restriction since RLS is dropped)
    const { data: horses, error: horsesError } = await supabase
      .from('horses')
      .select(`
        *,
        horse_traits (trait_name, trait_category, trait_value),
        horse_distances (distance),
        horse_surfaces (surface),
        horse_positions (position),
        horse_breeding (breed_id, percentage),
        horse_categories (category)
      `);

    if (horsesError) {
      console.error('Error fetching horses:', horsesError);
      throw horsesError;
    }

    console.log('Found total horses:', horses?.length);

    // For each live race, find matching horses based on surface and distance
    const raceMatches = [];
    
    for (const race of liveRaces || []) {
      console.log(`Processing race: ${race.race_name} - Surface: ${race.surface}, Distance: ${race.distance}, Tier: ${race.tier_restriction}`);
      
      // Only find matching horses for active races  
      let matchingHorses = [];
      // Compute matching horses for this race (active or inactive)
      matchingHorses = horses?.filter(horse => {
        // Check if horse has the matching surface preference
        const hasSurface = horse.horse_surfaces?.some(s => s.surface === race.surface);
        
        // Check if horse has the matching distance preference - skip for Cross Country races
        let hasDistance = true;
        const isCrossCountry = /cross country/i.test(race.race_name || '');
        if (!isCrossCountry && race.distance !== '0') {
          hasDistance = horse.horse_distances?.some(d => d.distance === race.distance);
        }
        
        // Check tier restriction  
        let tierMatch = false;
        console.log(`CHECKING TIER: Horse ${horse.name} (tier: ${horse.tier}, type: ${typeof horse.tier}) vs Race ${race.race_name} (restriction: ${race.tier_restriction}, type: ${typeof race.tier_restriction})`);
        
        if (race.tier_restriction === 'odd_grades') {
          tierMatch = horse.tier && [3, 5, 7, 9].includes(horse.tier);
          console.log(`ODD CHECK: tierMatch = ${tierMatch}, horse.tier = ${horse.tier}, includes result = ${[3, 5, 7, 9].includes(horse.tier)}`);
        } else if (race.tier_restriction === 'even_grades') {
          tierMatch = horse.tier && [2, 4, 6, 8].includes(horse.tier);
          console.log(`EVEN CHECK: tierMatch = ${tierMatch}, horse.tier = ${horse.tier}, includes result = ${[2, 4, 6, 8].includes(horse.tier)}`);
        } else {
          // If no tier restriction, allow all tiers
          tierMatch = true;
          console.log(`NO RESTRICTION: tierMatch = ${tierMatch}`);
        }

        const finalMatch = hasSurface && hasDistance && tierMatch;
        console.log(`FINAL: Horse ${horse.name} - Surface: ${hasSurface}, Distance: ${hasDistance}, Tier: ${tierMatch}, OVERALL: ${finalMatch}`);
        
        return finalMatch;
        }).map(horse => ({
          id: horse.id,
          name: horse.name,
          tier: horse.tier,
          speed: horse.speed,
          sprint_energy: horse.sprint_energy,
          acceleration: horse.acceleration,
          agility: horse.agility,
          jump: horse.jump,
          max_speed: horse.max_speed,
          max_sprint_energy: horse.max_sprint_energy,
          max_acceleration: horse.max_acceleration,
          max_agility: horse.max_agility,
          max_jump: horse.max_jump,
          traits: horse.horse_traits?.map(t => t.trait_name) || []
        })) || [];

      console.log(`Found ${matchingHorses.length} matching horses for race ${race.race_name}`);

      raceMatches.push({
        ...race,
        matchingHorses: matchingHorses.sort((a, b) => {
          // Sort by tier first (higher tier first)
          if (a.tier !== b.tier) return (b.tier || 0) - (a.tier || 0);
          // Then by speed (higher first)
          if (a.speed !== b.speed) return (b.speed || 0) - (a.speed || 0);
          // Then by sprint energy (higher first)
          if (a.sprint_energy !== b.sprint_energy) return (b.sprint_energy || 0) - (a.sprint_energy || 0);
          // Then by acceleration (higher first)
          if (a.acceleration !== b.acceleration) return (b.acceleration || 0) - (a.acceleration || 0);
          // Then by agility (higher first)
          if (a.agility !== b.agility) return (b.agility || 0) - (a.agility || 0);
          // Finally by jump (higher first)
          return (b.jump || 0) - (a.jump || 0);
        })
      });
    }

    return new Response(JSON.stringify({
      success: true,
      suggestions: [],
      liveRaces: liveRaces || [],
      raceMatches: raceMatches,
      totalHorses: horses?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in breeding-suggestions function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});