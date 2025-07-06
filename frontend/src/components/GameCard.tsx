'use client';

import { useEffect, useState } from 'react'
import { format } from 'date-fns';
import GameEditModal from './GameEditModal';
import { Game } from '@/app/types/Game';
import { UpdateGame } from '@/app/types/UpdateGame';
import { useGameStore } from '@/stores/gameStore';
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash, Pencil } from 'lucide-react';
import { log } from 'console';


export default function GameCard() {

  const { games, loading, error, fetchGames, deleteGame, editGame } = useGameStore();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game|null>(null);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleEdit = (id: number) => {
    const game = games.find((g) => g.id === id);
    if (game) {
      setSelectedGame(game);
      setEditModalOpen(true);
    }
  };

  const handleConfirmEdit = async (updatedGame: UpdateGame) => {
    console.log('Confirming edit for game:', updatedGame);
    await editGame(updatedGame);
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎮 Game List</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell>{game.id}</TableCell>
              <TableCell>{game.name}</TableCell>
              <TableCell>{game.genre ?? '—'}</TableCell>
              <TableCell>${game.price.toFixed(2)}</TableCell>
              <TableCell>{format(game.releaseDate, 'yyyy-MM-dd')}</TableCell>
              <TableCell className='whitespace-nowrap'>
                <Button variant="destructive" className='mr-2' 
                  onClick={() => deleteGame(game.id)}>
                  <Trash/> Delete 
                </Button>
                <Button onClick={() => handleEdit(game.id)}>
                  <Pencil/>Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <GameEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        game={selectedGame}
        onConfirm={handleConfirmEdit}
      />
    </div>
  );
}
