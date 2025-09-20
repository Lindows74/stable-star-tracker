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

    // Fetch active live races
    const { data: liveRaces, error: racesError } = await supabase
      .from('live_races')
      .select('*')
      .eq('is_active', true)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(20);

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
      
      // Find horses that match this race's surface, distance, and tier restriction
      const matchingHorses = horses?.filter(horse => {
        // Check if horse has the matching surface preference
        const hasSurface = horse.horse_surfaces?.some(s => s.surface === race.surface);
        
        // Check if horse has the matching distance preference - skip for Cross Country races (distance = '0')
        let hasDistance = true;
        if (race.distance !== '0') {
          hasDistance = horse.horse_distances?.some(d => d.distance === race.distance);
        }
        
        // Check tier restriction
        let tierMatch = false;
        if (race.tier_restriction === 'odd_grades') {
          tierMatch = horse.tier && [3, 5, 7, 9].includes(horse.tier);
        } else if (race.tier_restriction === 'even_grades') {
          tierMatch = horse.tier && [2, 4, 6, 8].includes(horse.tier);
        } else {
          // If no tier restriction, allow all tiers
          tierMatch = true;
        }
        
        return hasSurface && hasDistance && tierMatch;
      }).map(horse => ({
        id: horse.id,
        name: horse.name,
        tier: horse.tier,
        speed: horse.speed,
        sprint_energy: horse.sprint_energy,
        acceleration: horse.acceleration,
        agility: horse.agility,
        jump: horse.jump,
        traits: horse.horse_traits?.map(t => t.trait_name) || []
      })) || [];

      console.log(`Found ${matchingHorses.length} matching horses for race ${race.race_name}`);

      raceMatches.push({
        ...race,
        matchingHorses: matchingHorses.sort((a, b) => {
          // Sort by tier first (higher tier first), then by speed
          if (a.tier !== b.tier) return (b.tier || 0) - (a.tier || 0);
          return (b.speed || 0) - (a.speed || 0);
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