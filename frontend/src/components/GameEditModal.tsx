'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Game } from '@/app/types/Game';

interface GameEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: Game | null;
  onConfirm: (updated: Game) => void;
}

export default function GameEditModal({
  open,
  onOpenChange,
  game,
  onConfirm,
}: GameEditModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  useEffect(() => {
    if (game) {
      setName(game.name);
      setPrice(game.price.toString());
      setReleaseDate(new Date(game.releaseDate).toISOString().split('T')[0]);
    }
  }, [game]);

  const handleSubmit = () => {
    if (!game) return;

    const genreId = game.genreId ?? game.id; // 你要确保这里有 genreId

    onConfirm({
      id: game.id,
      name,
      genreId,
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
