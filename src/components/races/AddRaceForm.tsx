import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddRaceFormProps {
  onRaceAdded: () => void;
}

const AddRaceForm = ({ onRaceAdded }: AddRaceFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    raceType: "",
    distance: "",
    surface: "",
    trackName: "",
    startDate: "",
    startTime: ""
  });
  const { toast } = useToast();

  const raceTypes = [
    { value: "flat_racing", label: "Flat Racing" },
    { value: "steeplechase", label: "Steeplechase" },
    { value: "cross_country", label: "Cross Country" }
  ];

  const surfaces = [
    { value: "very_hard", label: "Very Hard" },
    { value: "hard", label: "Hard" },
    { value: "firm", label: "Firm" },
    { value: "medium", label: "Medium" },
    { value: "soft", label: "Soft" },
    { value: "very_soft", label: "Very Soft" }
  ];

  const distances = [
    "800", "900", "1000", "1200", "1400", "1600", "1800", "2000", 
    "2200", "2400", "2500", "2600", "2800", "3000", "3200"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.raceType || !formData.distance || !formData.surface || !formData.startDate || !formData.startTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const startDateTime = `${formData.startDate} ${formData.startTime}:00+00`;

      const { error } = await supabase
        .from('live_races')
        .insert([{
          race_name: `${formData.raceType.replace('_', ' ')} ${formData.distance}m ${formData.surface}`,
          surface: formData.surface,
          distance: formData.distance,
          start_time: startDateTime,
          track_name: formData.trackName || null,
          prize_money: null,
          is_active: true
        }]);

      if (error) {
        console.error('Error adding race:', error);
        toast({
          title: "Error",
          description: "Failed to add race. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Race added successfully!"
      });

      // Reset form
      setFormData({
        raceType: "",
        distance: "",
        surface: "",
        trackName: "",
        startDate: "",
        startTime: ""
      });
      setIsOpen(false);
      onRaceAdded();

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatSurface = (surface: string) => {
    return surface.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!isOpen) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <Button 
            onClick={() => setIsOpen(true)} 
            className="w-full"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Race
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Add New Race
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="raceType">Race Type *</Label>
              <Select 
                value={formData.raceType} 
                onValueChange={(value) => setFormData({...formData, raceType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select race type" />
                </SelectTrigger>
                <SelectContent>
                  {raceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="distance">Distance (meters) *</Label>
              <Select 
                value={formData.distance} 
                onValueChange={(value) => setFormData({...formData, distance: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  {distances.map((distance) => (
                    <SelectItem key={distance} value={distance}>
                      {distance}m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="surface">Surface *</Label>
              <Select 
                value={formData.surface} 
                onValueChange={(value) => setFormData({...formData, surface: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select surface" />
                </SelectTrigger>
                <SelectContent>
                  {surfaces.map((surface) => (
                    <SelectItem key={surface.value} value={surface.value}>
                      {formatSurface(surface.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trackName">Track Name</Label>
              <Input
                id="trackName"
                value={formData.trackName}
                onChange={(e) => setFormData({...formData, trackName: e.target.value})}
                placeholder="Enter track name"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>

            {/* Removed prize money field */}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Race...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Race
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddRaceForm;