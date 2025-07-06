'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UpdateGame } from '@/app/types/UpdateGame';
import { Game } from '@/app/types/Game';
import { useGenreStore } from '@/stores/genreStore';

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
  const [releaseDate, setReleaseDate] = useState('');
  const { genres, fetchGenres } =useGenreStore();

  useEffect(() => {
    if (game) {
      setName(game.name);
      setGenre(game.genre ? game.genre : '');
      setPrice(game.price.toString());
      setReleaseDate(new Date(game.releaseDate).toISOString().split('T')[0]);
    }
    fetchGenres();
  }, [game]);

  const handleSubmit = () => {
    if (!game) return;

    onConfirm({
      id: game.id,
      name: name, // Use the user input name
      genre: genre, // Use the user selected genre
      price: parseFloat(price),
      releaseDate: new Date(releaseDate),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Game Name" />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 border rounded-md text-sm w-fullmax-w-sm"
          >
            {genres.map((genre) => (
              <option key={genre.id}value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>

          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" />
          <Input value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} placeholder="Release Date" type="date" />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
