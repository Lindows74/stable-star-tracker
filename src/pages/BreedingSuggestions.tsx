import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Trophy, Target, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

interface MatchingHorse {
  id: number;
  name: string;
  tier: number;
  speed: number;
  sprint_energy: number;
  acceleration: number;
  agility: number;
  jump: number;
  traits: string[];
}

interface RaceMatch {
  id: number;
  race_name: string;
  surface: string;
  distance: string;
  start_time: string;
  track_name: string;
  prize_money: number;
  matchingHorses: MatchingHorse[];
}

const BreedingSuggestions = () => {
  const [raceMatches, setRaceMatches] = useState<RaceMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalHorses, setTotalHorses] = useState(0);
  const { toast } = useToast();

  // Auto-load data when component mounts
  useEffect(() => {
    fetchLiveRaces();
  }, []);

  const fetchLiveRaces = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('breeding-suggestions');

      if (error) {
        console.error('Error fetching live races:', error);
        toast({
          title: "Error",
          description: "Failed to get live races data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Response:', data);

      if (data.success) {
        setRaceMatches(data.raceMatches || []);
        setTotalHorses(data.totalHorses || 0);
        
        const totalMatches = data.raceMatches?.reduce((sum: number, race: RaceMatch) => sum + race.matchingHorses.length, 0) || 0;
        
        toast({
          title: "Success",
          description: `Found ${data.raceMatches?.length || 0} upcoming races with ${totalMatches} total horse matches from ${data.totalHorses || 0} horses in database.`,
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Breeding Suggestions</h2>
          <p className="text-muted-foreground">
            Live racing events and breeding targets based on race conditions.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{totalHorses}</div>
                  <div className="text-sm text-muted-foreground">Total Horses</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{raceMatches.length}</div>
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
                  <div className="text-2xl font-bold">{raceMatches.reduce((sum, race) => sum + race.matchingHorses.length, 0)}</div>
                  <div className="text-sm text-muted-foreground">Horse Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Load Button Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Load Race Data
              </CardTitle>
              <CardDescription>
                Get the latest live race information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground py-4">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click below to load upcoming races</p>
              </div>

              <Button 
                onClick={fetchLiveRaces} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Load Live Races
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Breeding Targets Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Race Matches
              </CardTitle>
              <CardDescription>
                Horses that match each race's surface and distance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {raceMatches.length > 0 ? (
                <div className="space-y-6">
                  {raceMatches.map((raceMatch) => (
                    <Card key={raceMatch.id} className="border-l-4 border-blue-500">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <div className="font-semibold text-xl mb-2">{raceMatch.race_name}</div>
                          <div className="text-sm text-muted-foreground mb-3">
                            {raceMatch.track_name} • {formatDateTime(raceMatch.start_time)}
                          </div>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">Surface:</span>
                              <Badge variant="secondary">
                                {raceMatch.surface.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">Distance:</span>
                              <Badge variant="outline">
                                {raceMatch.distance}m
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <Trophy className="h-4 w-4" />
                              ${raceMatch.prize_money?.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium mb-3">
                            Matching Horses ({raceMatch.matchingHorses.length})
                          </div>
                          
                          {raceMatch.matchingHorses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {raceMatch.matchingHorses.map((horse) => (
                                <div key={horse.id} className="bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{horse.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      Tier {horse.tier}
                                    </Badge>
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
                                    <div>Speed: {horse.speed}</div>
                                    <div>Sprint: {horse.sprint_energy}</div>
                                    <div>Accel: {horse.acceleration}</div>
                                    <div>Agility: {horse.agility}</div>
                                    <div>Jump: {horse.jump}</div>
                                    <div className="col-span-2 mt-1">
                                      Traits: {horse.traits.length}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              No horses match this race's requirements
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Race Matches Loaded</h3>
                  <p className="text-sm mb-4">
                    Click "Load Live Races" to see which horses match upcoming race requirements
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BreedingSuggestions;