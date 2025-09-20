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
import { TraitsByDisciplineInline } from "@/components/horses/TraitsByDisciplineInline";

interface MatchingHorse {
  id: number;
  name: string;
  tier: number;
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
        // Show all races including inactive ones (like "under repair" races)
        const allRaces = data.liveRaces || [];
        const raceMatchesWithAll = allRaces.map((race: any) => ({
          ...race,
          matchingHorses: race.is_active ? 
            (data.raceMatches?.find((rm: any) => rm.id === race.id)?.matchingHorses || []) : 
            [] // No matching horses for inactive races
        }));
        
        // Sort to match the official list: 17 Flat, 3 Steeplechase (incl. 1100m under repair), then Cross Country
        const flatOrder = [
          { d: '800', s: 'very_soft' },
          { d: '900', s: 'firm' },
          { d: '1000', s: 'hard' },
          { d: '1200', s: 'medium' },
          { d: '1200', s: 'very_soft' },
          { d: '1400', s: 'medium' },
          { d: '1600', s: 'firm' },
          { d: '1600', s: 'hard' },
          { d: '1600', s: 'very_hard' },
          { d: '1800', s: 'very_hard' },
          { d: '2000', s: 'hard' },
          { d: '2000', s: 'soft' },
          { d: '2400', s: 'firm' },
          { d: '2800', s: 'very_hard' },
          { d: '3000', s: 'hard' },
          { d: '3200', s: 'soft' },
          { d: '3200', s: 'very_hard' },
        ];
        const steepleOrder = [
          { d: '900', s: 'very_hard' },
          { d: '1100', s: 'very_hard' }, // Under Repair (even grades)
          { d: '1400', s: 'firm' },
        ];
        
        const isSteeple = (r: any) => /steeplechase/i.test(r.race_name || '');
        const isCrossCountry = (r: any) => r.distance === '0' || /cross country/i.test(r.race_name || '');
        
        const flats = raceMatchesWithAll.filter((r: any) => !isSteeple(r) && !isCrossCountry(r));
        const steeples = raceMatchesWithAll.filter((r: any) => isSteeple(r));
        const cross = raceMatchesWithAll.filter((r: any) => isCrossCountry(r));
        
        const sortByOrder = (arr: any[], order: { d: string; s: string }[]) =>
          arr.sort((a, b) => {
            const ia = order.findIndex(o => o.d === a.distance && o.s === a.surface);
            const ib = order.findIndex(o => o.d === b.distance && o.s === b.surface);
            const na = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
            const nb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
            return na - nb;
          });
        
        const flatsSorted = sortByOrder(flats, flatOrder);
        const steeplesSorted = sortByOrder(steeples, steepleOrder);
        const crossSorted = cross.sort((a: any, b: any) => {
          // Very Hard first, then Very Soft, then others
          const pref = (s: string) => (s === 'very_hard' ? 0 : s === 'very_soft' ? 1 : 2);
          return pref(a.surface) - pref(b.surface);
        });
        
        const sorted = [...flatsSorted, ...steeplesSorted, ...crossSorted];
        
        setRaceMatches(sorted);
        setTotalHorses(data.totalHorses || 0);
        
        const totalMatches = sorted.reduce((sum: number, race: any) => sum + race.matchingHorses.length, 0);
        
        toast({
          title: "Success",
          description: `Found ${sorted.length} live events with ${totalMatches} matching horses from ${data.totalHorses || 0} horses in database.`,
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
                    raceLabel = `Race ${raceNumber} - ${raceType}`;
                  } else if (raceNumber <= 20) {
                    raceType = "Steeplechase";
                    raceLabel = `Race ${raceNumber} - ${raceType}`;
                    if (race.race_name?.includes('Under Repair')) {
                      raceLabel += ' (Under Repair)';
                    }
                  } else {
                    raceType = "Cross Country";
                    raceLabel = `Race ${raceNumber} - ${raceType} (Surface preference only)`;
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
                             <TableHead>Traits</TableHead>
                           </TableRow>
                         </TableHeader>
                         <TableBody>
                           {race.matchingHorses.map((horse) => (
                             <TableRow key={horse.id}>
                               <TableCell className="font-medium">{horse.name}</TableCell>
                               <TableCell>
                                 <Badge variant="outline">Tier {horse.tier}</Badge>
                               </TableCell>
                               <TableCell className="max-w-md">
                                 <TraitsByDisciplineInline 
                                   traits={horse.traits?.map(traitName => ({ trait_name: traitName })) || []}
                                   allTraitNames={horse.traits || []}
                                 />
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