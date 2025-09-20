import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Calendar, Trophy, Target, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [liveRaces, setLiveRaces] = useState<LiveRace[]>([]);
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
        setLiveRaces(data.liveRaces || []);
        setTotalHorses(data.totalHorses || 0);
        
        toast({
          title: "Success",
          description: `Found ${data.liveRaces?.length || 0} upcoming races and ${data.totalHorses || 0} horses in database.`,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Live Racing Events
            </h1>
          </div>
          <p className="text-muted-foreground">
            Upcoming races with surface and distance information for breeding targets
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
                  <div className="text-2xl font-bold">{liveRaces.length}</div>
                  <div className="text-sm text-muted-foreground">Breeding Targets</div>
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
                Breeding Targets
              </CardTitle>
              <CardDescription>
                Plan your breeding strategy around these upcoming race requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {liveRaces.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Target these surface and distance combinations for optimal breeding results:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveRaces.map((race) => (
                      <Card key={race.id} className="border-l-4 border-green-500 hover:border-green-600 transition-colors">
                        <CardContent className="p-4">
                          <div className="font-semibold text-lg mb-2">{race.race_name}</div>
                          <div className="text-sm text-muted-foreground mb-3">
                            {race.track_name}
                          </div>
                          
                          {/* Key breeding targets */}
                          <div className="space-y-3 mb-4">
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Target Surface:</div>
                              <Badge variant="secondary" className="text-sm">
                                {race.surface.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Target Distance:</div>
                              <Badge variant="outline" className="text-sm">
                                {race.distance}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDateTime(race.start_time)}
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                              <Trophy className="h-3 w-3" />
                              ${race.prize_money?.toLocaleString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Live Races Loaded</h3>
                  <p className="text-sm mb-4">
                    Click "Load Live Races" to see upcoming race targets for breeding planning
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BreedingSuggestions;