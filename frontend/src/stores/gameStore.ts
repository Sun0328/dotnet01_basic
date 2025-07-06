import { create } from 'zustand';
import { Game } from '@/app/types/Game';
import { UpdateGame } from '@/app/types/UpdateGame';
import { getAll, getById, remove, update } from '@/lib/apiClient';
import { useGenreStore } from './genreStore';
import { toast } from 'sonner'
import { id } from 'date-fns/locale';

interface GameState {
  games: Game[];
  loading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  deleteGame: (id: number) => Promise<void>;
  editGame: (updatedGame: Game) => Promise<void>;
  searchById: (id: number) => Promise<void>;
  searchByGenre: (name: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set) => ({
  games: [],
  loading: false,
  error: null,

  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAll();
      const mapped = data.map((game) => ({
        ...game,
        releaseDate: new Date(game.releaseDate),
      }));
      set({ games: mapped });
      toast.success('All Games fetched successfully');
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Error fetching games');
    } finally {
      set({ loading: false });
    }
  },

  editGame: async (updatedGame: UpdateGame) => {
    set({ loading: true, error: null });
    try {
      // Get genreId from genre store
        const genreId = updatedGame.genre 
          ? useGenreStore.getState().getGenreIdByName(updatedGame.genre) 
          : (updatedGame.genreId || 0); // Use existing genreId if genre name is not provided
        
        const payload: UpdateGame = {
          id: updatedGame.id, // Ensure ID is included
          name: updatedGame.name,
          genreId: genreId,
          price: updatedGame.price,
          releaseDate: updatedGame.releaseDate,
        }

        const savedGame = await update(payload);
        toast.success(`Game ID ${savedGame.id} updated successfully`);
        
        // Refresh the games list to show updated data
        await useGameStore.getState().fetchGames();
    } catch (err) {
        console.error('Edit error:', err);
        toast.error('Failed to update game');
        set({ error: 'Failed to update game' });
    } finally {
        set({ loading: false });
    }
  },

  deleteGame: async (id: number) => {
    const confirm = window.confirm(`Are you sure you want to delete game ID ${id}?`);
    if (!confirm) return;

    try {
      const success = await remove(id);
      if (success) {
        set((state) => ({
          games: state.games.filter((game) => game.id !== id),
        }));
        toast.success(`Game ID ${id} deleted successfully`);
      } else {
        toast.error('Failed to delete game on server');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Error deleting game');
    }
  },

  searchById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const game = await getById(id);
      
      if (!game) {
        // Game not found
        set({ games: [] });
        toast.error(`No game found with ID ${id}`);
        return;
      }
      
      // get genre name from genre store
      const genreName = useGenreStore.getState().getGenreNameById(game.genreId);  

      set({
        games: [{
          ...game,
          releaseDate: new Date(game.releaseDate),
          genre: genreName,
        }],
      });
      toast.success(`Game ID ${id} found`);
    } catch (err) {
      // Handle other errors (network, server errors, etc.)
      set({ games: [] });
      toast.error(`Error searching for game with ID ${id}`);
    } finally {
      set({ loading: false });
    }
  },

  searchByGenre: async (genreName: string) => {
        set({ loading: true, error: null });
        try {
            const allGames = await getAll();
            const matchedGames = allGames
            .filter((game) => game.genre?.toLowerCase() === genreName.toLowerCase())
            .map((game) => ({
                ...game,
                releaseDate: new Date(game.releaseDate),
            }));
            set({ games: matchedGames });
            if (matchedGames.length === 0) {
                toast.error(`No games found for genre: ${genreName}`);
            } else {
                toast.success(`Games for genre: ${genreName} fetched successfully`);
            }
        } catch (err) {
            console.error('Genre search error:', err);
            set({ error: 'Error searching by genre' });
            toast.error(`Error searching for genre: ${genreName}`);
        } finally {
            set({ loading: false });
        }
  }

}));
