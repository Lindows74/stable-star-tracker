import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Loader2, Calendar, Trophy, Target, Zap, Star, Clock, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIBreedingSuggestion {
  parent1: { id: number; name: string };
  parent2: { id: number; name: string };
  targetRace: { name: string; surface: string; distance: string };
  expectedTraits: string[];
  reasoning: string;
  compatibilityScore: number;
  tierImprovement: string;
  estimatedOffspringTier: number;
}

interface LiveRace {
  id: number;
  race_name: string;
  surface: string;
  distance: string;
  start_time: string;
  track_name: string;
  prize_money: number;
}

const BreedingSuggestions = () => {
  const [suggestions, setSuggestions] = useState<AIBreedingSuggestion[]>([]);
  const [liveRaces, setLiveRaces] = useState<LiveRace[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalHorses, setTotalHorses] = useState(0);
  const { toast } = useToast();

  const traitDescriptions = {
    // Pro Traits
    "Blazing Hoof Pro": "Superior Speed across all game modes.",
    "Fleet Dash Pro": "Superior Sprint Energy across all game modes.",
    "Agile Arrow Pro": "Superior Agility across all game modes.",
    "Flash Ignite Pro": "Superior Acceleration across all game modes.",
    "To The Moon Pro": "Superior Jump across all game modes.",
    "Endless Stride Pro": "On Flat Racing tracks of 2400m or more, gain superior acceleration and Sprint Energy lasts longer.",
    "Rolling Current Pro": "On hard surfaces recharge extra Sprint Energy when jumping and gain superior Acceleration in Cross Country races.",
    "Streak Shield Pro": "In Steeplechase mode, while a perfect streak is active, missing a perfect jump will not break the streak. Activates 3 times per race.",

    // General Traits
    "Blazing Hoof": "Improved Speed across all game modes. Turns Pro if the horse is 80% Thoroughbred.",
    "Fleet Dash": "Improved Sprint Energy across all game modes. Turns Pro if the horse is 80% Arabian or Mustang.",
    "Agile Arrow": "Improved Agility across all game modes. Turns Pro if the horse is 80% Knabstrupper.",
    "Flash Ignite": "Improved Acceleration across all game modes. Turns Pro if the horse is 80% Quarter Horse.",
    "To The Moon": "Improved Jump across all game modes. Turns Pro if the horse is 80% Selle Francais or Knabstrupper.",
    "Energy Saver": "Story Races only costs 1 Career Energy.",
    "Endless Stride": "On Flat Racing tracks of 2400m or more, gains improved acceleration and Sprint Energy lasts longer. Turns pro if horse is 80% or higher Akhal-Teke.",
    "Rolling Current": "On hard surfaces recharge extra Sprint Energy when jumping and gain improved Acceleration in Cross Country races. Turns pro if horse is 80% or higher Anglo-Arab.",
    "Streak Shield": "In Steeplechase mode, while a perfect streak is active, missing a perfect jump will not break the streak. Activates 2 times per race.",

    // Surface Preference
    "Granite Gallop": "Extends preference to hard and very hard surfaces.",
    "Mid Dash": "Extends preference to firm and medium surfaces.",
    "Swampy Strider": "Extends preference to soft and very soft surfaces.",

    // Flat Racing
    "Lightning Bolt": "Faster stamina refill rate during the final stretch in Flat Racing. Can stack with Hard 'N' Fast.",
    "Top Endurance": "Start with more Sprint Energy in Flat Racing.",

    // Steeplechase
    "Leaping Star": "Max jump streak in Steeplechase. Can stack with Leaping Lancer for even further increased jump streak.",
    "Perfect Step": "Improved boost for perfect jumps in Steeplechase. Can stack with Leaping Lancer for even greater boost.",
    "Leaping Lancer": "Max jump streak in Steeplechase is increased by 1. Improved boost when you perform a perfect jump. Can stack with Leaping Star and Perfect Step.",
    "Kinetic Boost": "While your perfect jump streak is 5 or higher, receive bonus sprint energy on each subsequent perfect jump.",

    // Cross Country
    "River Rider": "Horse is not slowed by water in Cross Country.",
    "Fast Draw": "Increased speed boost during jumps in Cross Country.",
    "Meadowstride": "Horse is not slowed down by water in Cross Country. Increased speed boost during jumps in Cross Country.",

    // Distance Preference
    "Quick Gallop": "Extends preference to 800m and 900m.",
    "Swift Trot": "Extends preference to 1,000m, 1,100m, and 1,200m.",
    "Steady Strider": "Extends preference to 1,400m and 1,600m.",
    "Meadow Runner": "Extends preference to 1,800m, 2,000m, and 2,200m.",
    "Endurance Charger": "Extends preference to 2,400m and 2,600m.",
    "Marathon Trotter": "Extends preference to 2,800m, 3,000m, and 3,200m.",

    // Exotic Traits
    "Steam Burst": "On Flat Racing tracks between 800m and 1200m, sprinting increases your acceleration and maximum top speed but uses more Sprint Energy.",
    "Short Star": "Extends preference range to include 1,200m and below.",
    "Mid Miracle": "Extends preference range to include 1,400m to 2,200m.",
    "Marathon Master": "Extends preference range to include 2,400m and higher.",
    "Thundering Hooves": "Starts with full stamina bar. Extends preference range to include 2,800m and higher.",
    "Hard 'N' Fast": "Faster stamina refill rate during final stretch. Extends Preference range to include hard and very hard surfaces. Can stack with Lightning Bolt.",

    // Cosmetic
    "Majestic Mane": "The horse will have a Majestic, Long Mane.",
    "Crystal Coat": "A lustrous coat makes your horse shine like no other.",
    "Noble Braid": "Tightly sewn braids that add refined charm to your horse's presence.",

    // Star Club
    "Thrifty Spender": "Reduced entry fee in Live Events.",
    "Elite Lineage": "Foals born from this horse have +1 to all Base Stats except for A+.",
    "Top Student": "All foals bred from this horse have 20% of their possible XP but still require training."
  };

  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to get personalized breeding suggestions.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('breeding-suggestions', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) {
        console.error('Error fetching breeding suggestions:', error);
        toast({
          title: "Error",
          description: "Failed to get breeding suggestions. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('AI response:', data);

      if (data.success) {
        setSuggestions(data.suggestions || []);
        setLiveRaces(data.liveRaces || []);
        setTotalHorses(data.totalHorses || 0);
        
        toast({
          title: "Success",
          description: `Generated ${data.suggestions?.length || 0} AI-powered breeding suggestions based on ${data.liveRaces?.length || 0} upcoming races.`,
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 9) return "text-green-600";
    if (score >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AI-Powered Breeding Suggestions
              </h1>
            </div>
            <p className="text-muted-foreground">
              Smart breeding recommendations based on your stable and upcoming live races
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{totalHorses}</div>
                    <div className="text-sm text-muted-foreground">Horses in Stable</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{liveRaces.length}</div>
                    <div className="text-sm text-muted-foreground">Upcoming Races</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{suggestions.length}</div>
                    <div className="text-sm text-muted-foreground">AI Suggestions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Races Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Live Races
                </CardTitle>
                <CardDescription>
                  AI analyzes these races for breeding optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {liveRaces.length > 0 ? (
                  liveRaces.map((race) => (
                    <Card key={race.id} className="border-l-4 border-primary">
                      <CardContent className="p-3">
                        <div className="font-semibold text-sm">{race.race_name}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {race.track_name}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary" className="text-xs">
                              {race.surface}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {race.distance}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(race.start_time)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Trophy className="h-3 w-3" />
                            ${race.prize_money?.toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming races found</p>
                  </div>
                )}

                <Button 
                  onClick={fetchAIRecommendations} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Get AI Suggestions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Suggestions Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  AI Breeding Recommendations
                </CardTitle>
                <CardDescription>
                  Strategic breeding combinations optimized for upcoming races
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                      <p className="text-lg font-semibold">Analyzing Your Stable...</p>
                      <p className="text-sm text-muted-foreground">
                        AI is evaluating horses and upcoming races
                      </p>
                    </div>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-6">
                    {suggestions.map((suggestion, index) => (
                      <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary text-lg">
                                  {suggestion.parent1.name}
                                </span>
                                <Heart className="h-5 w-5 text-pink-500" />
                                <span className="font-bold text-primary text-lg">
                                  {suggestion.parent2.name}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Compatibility</div>
                              <div className={`text-2xl font-bold ${getCompatibilityColor(suggestion.compatibilityScore)}`}>
                                {suggestion.compatibilityScore}/10
                              </div>
                            </div>
                          </div>

                          {/* Target Race */}
                          <div className="bg-gradient-to-r from-primary/5 to-purple/5 rounded-lg p-4 mb-4">
                            <div className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Optimized for: {suggestion.targetRace.name}
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary">
                                {suggestion.targetRace.surface}
                              </Badge>
                              <Badge variant="outline">
                                {suggestion.targetRace.distance}
                              </Badge>
                            </div>
                          </div>

                          {/* Expected Traits */}
                          <div className="space-y-3 mb-4">
                            <div className="text-sm font-semibold">Expected Traits:</div>
                            <div className="flex flex-wrap gap-2">
                              {suggestion.expectedTraits.map((trait) => (
                                <div key={trait} className="flex items-center gap-1">
                                  <Badge variant="default" className="text-xs">
                                    {trait}
                                  </Badge>
                                  {traitDescriptions[trait] && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="max-w-xs">
                                        <p className="text-sm">{traitDescriptions[trait]}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* AI Reasoning */}
                          <div className="bg-muted/50 rounded-lg p-4 mb-4">
                            <div className="text-sm font-semibold mb-2">AI Analysis:</div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {suggestion.reasoning}
                            </p>
                          </div>

                          {/* Performance Metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-sm text-muted-foreground">Estimated Tier</div>
                              <div className="text-xl font-bold text-green-600">
                                {suggestion.estimatedOffspringTier}
                              </div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm text-muted-foreground">Improvement</div>
                              <div className="text-sm font-semibold text-blue-600">
                                {suggestion.tierImprovement}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-semibold mb-2">No Suggestions Yet</p>
                    <p className="text-muted-foreground mb-4">
                      Click "Get AI Suggestions" to analyze your stable and upcoming races
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BreedingSuggestions;