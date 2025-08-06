'use client';

import { useEffect, useState } from 'react'
import { format } from 'date-fns';
import GameEditModal from './GameEditModal';
import GameAddModal from './GameAddModal';
import GameDeleteModal from './GameDeleteModal';
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
import { Trash, Pencil, Plus } from 'lucide-react';


export default function GameCard() {

  const { games, loading, error, hasSearched, fetchGames, deleteGame, editGame, addGame, showAllGames } = useGameStore();
  // Edit Game
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  // New Game
  const [addModalOpen, setAddModalOpen] = useState(false);
  // Delete Game
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Handle updating a existing game
  const handleEdit = (id: number) => {
    const game = games.find((g) => g.id === id);
    if (game) {
      setSelectedGame(game);
      setEditModalOpen(true);
    }
  };

  const handleConfirmEdit = async (updatedGame: UpdateGame) => {
    console.log('Confirming edit for game:', updatedGame);
    if (selectedGame && updatedGame.id) {
      await editGame({ ...updatedGame, id: updatedGame.id } as Game);
    }
  };

  // Handle adding a new game
  const handleAddGame = async (newGame: UpdateGame) => {
    console.log('Adding new game...', newGame);
    await addGame(newGame);
    // No need to call fetchGames() here as addGame() already refreshes the list
  };

  // Handle deleting a game
  const handleDelete = (id: number) => {
    const game = games.find((g) => g.id === id);
    if (game) {
      setGameToDelete(game);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (gameToDelete) {
      console.log('Confirming delete for game:', gameToDelete);
      await deleteGame(gameToDelete.id);
      setGameToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🎮 Game List</h2>
        <div className="flex gap-2">
          {hasSearched && (
            <Button
              variant="outline"
              onClick={showAllGames}
            >
              Show All
            </Button>
          )}
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Game
          </Button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Table>
        <TableHeader className='text-xl font-bold'>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game, index) => (
            <TableRow key={game.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{game.name}</TableCell>
              <TableCell>{game.genre ?? '—'}</TableCell>
              <TableCell>${game.price.toFixed(2)}</TableCell>
              <TableCell>{format(game.releaseDate, 'yyyy-MM-dd')}</TableCell>
              <TableCell className='whitespace-nowrap'>
                <Button variant="destructive" className='mr-2'
                  onClick={() => handleDelete(game.id)}>
                  <Trash /> Delete
                </Button>
                <Button onClick={() => handleEdit(game.id)}>
                  <Pencil />Edit
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
      <GameAddModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onConfirm={handleAddGame}
      />
      <GameDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        game={gameToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
