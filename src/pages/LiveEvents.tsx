import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar, Trophy, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import AddRaceForm from "@/components/races/AddRaceForm";

interface MatchingHorse {
  id: number;
  name: string;
  tier: number;
}

interface RaceMatch {
  id: number;
  race_name: string;
  surface: string;
  distance: string;
  start_time: string;
  track_name: string;
  prize_money: number;
  tier_restriction: string;
  matchingHorses: MatchingHorse[];
}

const LiveEvents = () => {
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
          description: `Found ${data.raceMatches?.length || 0} live events with ${totalMatches} matching horses from ${data.totalHorses || 0} horses in database.`,
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
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatSurface = (surface: string) => {
    return surface.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Live Events</h1>
            <p className="text-muted-foreground mt-2">
              All upcoming races and matching horses from your database
            </p>
          </div>
          <Button onClick={fetchLiveRaces} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Events
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{raceMatches.length}</div>
                  <div className="text-sm text-muted-foreground">Live Events</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{totalHorses}</div>
                  <div className="text-sm text-muted-foreground">Total Horses</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {raceMatches.reduce((sum, race) => sum + race.matchingHorses.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Race Form */}
        <AddRaceForm onRaceAdded={fetchLiveRaces} />

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Race Events & Matching Horses</CardTitle>
          </CardHeader>
          <CardContent>
            {raceMatches.length > 0 ? (
              <div className="space-y-6">
                {raceMatches.map((race, index) => {
                  const raceNumber = index + 1;
                  let raceType = "";
                  let raceLabel = "";
                  
                  if (raceNumber <= 17) {
                    raceType = "Flat Racing";
                    raceLabel = `${raceType} Race ${raceNumber}`;
                  } else if (raceNumber <= 19) {
                    raceType = "Steeplechase";
                    const steeplechaseNumber = raceNumber - 17; // Steeplechase 1 or 2
                    raceLabel = `${raceType} Race ${steeplechaseNumber}`;
                  } else {
                    raceType = "Cross Country";
                    const ccNumber = raceNumber - 19; // Cross Country 1 or 2
                    raceLabel = `${raceType} ${ccNumber} (Surface preference only)`;
                  }
                  
                  return (
                    <div key={race.id} className="border rounded-lg p-6">
                       <div className="mb-4">
                           <h3 className="text-lg font-semibold">{raceLabel}</h3>
                       </div>

                    <div className="flex gap-4 mb-4">
                      {race.distance !== '0' && (
                        <Badge variant="outline" className="text-sm">
                          Distance: {race.distance}m
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-sm">
                        Surface: {formatSurface(race.surface)}
                      </Badge>
                      {race.tier_restriction && (
                        <Badge variant="outline" className="text-sm">
                          {race.tier_restriction === 'odd_grades' ? 'Odd Grades (3,5,7,9)' : 'Even Grades (2,4,6,8)'}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-sm">
                        {race.matchingHorses.length} Matching Horses
                      </Badge>
                    </div>

                    {race.matchingHorses.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Horse Name</TableHead>
                            <TableHead>Tier</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {race.matchingHorses.map((horse) => (
                            <TableRow key={horse.id}>
                              <TableCell className="font-medium">{horse.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">Tier {horse.tier}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No horses match this race's surface and distance requirements
                      </div>
                     )}
                   </div>
                  );
                })}
               </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Events Loaded</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Refresh Events" to load the latest race data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LiveEvents;