'use client';

import { useState, useEffect } from 'react';
import { UpdateGame } from '@/app/types/UpdateGame';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGenreStore } from '@/stores/genreStore';
import { Label } from '@radix-ui/react-dropdown-menu';
import DatePicker from './DatePicker';

import { toast } from 'sonner'

interface GameAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (updated: UpdateGame) => void;
}

export default function GameEditModal({
  open,
  onOpenChange,
  onConfirm,
}: GameAddModalProps) {
  const [name, setName] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined);

  const { genres, fetchGenres, getGenreIdByName } = useGenreStore();

  // Load genres when modal opens and reset form
  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setName('');
      setGenre('');
      setPrice('');
      setReleaseDate(undefined);

      // Load genres if needed
      if (genres.length === 0) {
        fetchGenres();
      }
    }
  }, [open, genres.length, fetchGenres]);

  // Handle submission of the new game
  const handleSubmit = () => {
    // Validate inputs
    if (!name || !genre || !price || !releaseDate) {
      toast.error('Please fill in all fields');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (parsedPrice < 1 || parsedPrice > 100) {
      toast.error('Price must be between $1 and $100');
      return;
    }

    const genreId = getGenreIdByName(genre);
    if (!genreId) {
      toast.error('Invalid genre selected');
      return;
    }

    const newGame: UpdateGame = {
      name,
      genreId: genreId,
      genre: genre,
      price: parsedPrice,
      releaseDate: releaseDate as Date
    };

    console.log('Submitting new game from modal:', newGame);
    onConfirm(newGame);

    // Form will be reset when modal reopens, so no need to reset here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-2">
          <Label className="text-sm">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Game Name" />

          <Label className="text-sm">Genre</Label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 border rounded-md text-sm w-full max-w-sm"
          >
            <option value="" disabled>
              Select Genre
            </option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>

          <Label className="text-sm">Price</Label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="(1-$100)" type="number" />

          <Label className="text-sm">Release Date</Label>
          <DatePicker
            value={releaseDate}
            onChange={setReleaseDate}
            placeholder="Select date"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
