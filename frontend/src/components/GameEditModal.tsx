'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UpdateGame } from '@/app/types/UpdateGame';
import { Game } from '@/app/types/Game';
import { useGenreStore } from '@/stores/genreStore';
import { Label } from '@radix-ui/react-dropdown-menu';
import DatePicker from './DatePicker';

import { toast } from 'sonner'

interface GameEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: Game | null;
  onConfirm: (updated: UpdateGame) => void;
}

export default function GameEditModal({
  open,
  onOpenChange,
  game,
  onConfirm,
}: GameEditModalProps) {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined);
  const { genres, fetchGenres, getGenreIdByName } = useGenreStore();

  useEffect(() => {
    if (open && game) {
      // Reset form with original game data when modal opens
      setName(game.name);
      setGenre(game.genre ? game.genre : '');
      setPrice(game.price.toString());
      setReleaseDate(new Date(game.releaseDate));
    }

    // Load genres if needed
    if (open && genres.length === 0) {
      fetchGenres();
    }
  }, [open, game, genres.length, fetchGenres]);

  const handleSubmit = () => {
    if (!game) {
      toast.error('No game selected for editing');
      return;
    }

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

    const updatedGame: UpdateGame = {
      id: game.id,
      name: name,
      genreId: genreId,
      genre: genre,
      price: parsedPrice,
      releaseDate: releaseDate,
    };

    console.log('Submitting updated game from modal:', updatedGame);
    onConfirm(updatedGame);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
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
