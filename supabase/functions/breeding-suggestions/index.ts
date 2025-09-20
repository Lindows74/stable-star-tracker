import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Starting breeding suggestions analysis...');

    // Get current user
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User authenticated:', user.id);

    // Fetch active live races
    const { data: liveRaces, error: racesError } = await supabase
      .from('live_races')
      .select('*')
      .eq('is_active', true)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(5);

    if (racesError) {
      console.error('Error fetching live races:', racesError);
      throw racesError;
    }

    console.log('Found live races:', liveRaces?.length);

    // Fetch user's horses with all related data
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
      `)
      .eq('user_id', user.id);

    if (horsesError) {
      console.error('Error fetching horses:', horsesError);
      throw horsesError;
    }

    console.log('Found user horses:', horses?.length);

    // Get all breeds for reference
    const { data: breeds, error: breedsError } = await supabase
      .from('breeds')
      .select('*');

    if (breedsError) {
      console.error('Error fetching breeds:', breedsError);
      throw breedsError;
    }

    // Prepare data for OpenAI analysis
    const analysisData = {
      liveRaces: liveRaces || [],
      horses: horses || [],
      breeds: breeds || []
    };

    const prompt = `
You are an expert horse racing breeding consultant. Analyze the following data and provide intelligent breeding suggestions to optimize for upcoming live races.

LIVE RACES DATA:
${JSON.stringify(liveRaces, null, 2)}

USER'S HORSES:
${JSON.stringify(horses, null, 2)}

AVAILABLE BREEDS:
${JSON.stringify(breeds, null, 2)}

TASK:
Based on the upcoming live races (surface types, distances, prize money), analyze the user's current stable and suggest the TOP 5 most strategic breeding combinations that would:

1. Create offspring optimized for the upcoming race surfaces and distances
2. Maximize potential for first-class performance in high-value races
3. Combine complementary traits effectively
4. Consider breeding percentages and genetic diversity

For each suggestion, provide:
- Parent horse names and IDs
- Target race it's optimized for
- Expected key traits in offspring
- Strategic reasoning
- Compatibility score (1-10)
- Estimated tier improvement potential

Respond in this EXACT JSON format:
{
  "suggestions": [
    {
      "parent1": { "id": number, "name": "string" },
      "parent2": { "id": number, "name": "string" },
      "targetRace": { "name": "string", "surface": "string", "distance": "string" },
      "expectedTraits": ["trait1", "trait2", "trait3"],
      "reasoning": "detailed explanation",
      "compatibilityScore": number,
      "tierImprovement": "string",
      "estimatedOffspringTier": number
    }
  ]
}
`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert horse racing breeding consultant. Always respond with valid JSON in the exact format requested. Be strategic and consider real racing dynamics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI response received');

    let suggestions;
    try {
      const content = aiResponse.choices[0].message.content;
      console.log('AI content:', content);
      suggestions = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', aiResponse.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify({
      success: true,
      ...suggestions,
      liveRaces: liveRaces || [],
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