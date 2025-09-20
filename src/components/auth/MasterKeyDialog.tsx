import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MasterKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MasterKeyDialog = ({ isOpen, onClose, onSuccess }: MasterKeyDialogProps) => {
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isValid = authenticate(key);
    
    if (isValid) {
      toast({
        title: 'Authentication successful',
        description: 'You now have access to horse management features.',
      });
      setKey('');
      onClose();
      onSuccess();
    } else {
      toast({
        title: 'Invalid master key',
        description: 'Please check your key and try again.',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setKey('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Master Key Required
          </DialogTitle>
          <DialogDescription>
            Enter the master key to access horse management features.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter master key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!key.trim() || isLoading}>
              {isLoading ? 'Verifying...' : 'Unlock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};