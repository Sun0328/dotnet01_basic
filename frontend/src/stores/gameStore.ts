import { create } from "zustand";
import { Game } from "@/app/types/Game";
import { UpdateGame } from "@/app/types/UpdateGame";
import {
  createAsyncStore,
  AsyncStoreState,
  AsyncStoreActions,
  executeAsyncOperation,
} from "./base/createAsyncStore";
import { GameActions } from "./actions/gameActions";

interface GameState extends AsyncStoreState, AsyncStoreActions {
  games: Game[];
  hasSearched: boolean;
  fetchGames: (showSuccessToast?: boolean) => Promise<void>;
  deleteGame: (id: number) => Promise<void>;
  editGame: (updatedGame: UpdateGame) => Promise<void>;
  addGame: (newGame: UpdateGame) => Promise<void>;
  searchByName: (name: string) => Promise<void>;
  searchByGenre: (name: string) => Promise<void>;
  showAllGames: () => Promise<void>;
}

export const useGameStore = create<GameState>(
  createAsyncStore((set, get) => ({
    games: [],
    hasSearched: false,

    fetchGames: async (showSuccessToast = true) => {
      const games = await executeAsyncOperation(
        () => GameActions.fetchGames(showSuccessToast),
        get(),
        "Error fetching games"
      );
      if (games) set({ games });
    },

    addGame: async (newGame: UpdateGame) => {
      const result = await executeAsyncOperation(
        () => GameActions.addGame(newGame),
        get(),
        "Failed to add game"
      );
      if (result) await get().fetchGames(false);
    },

    editGame: async (updatedGame: UpdateGame) => {
      const result = await executeAsyncOperation(
        () => GameActions.updateGame(updatedGame),
        get(),
        "Failed to update game"
      );
      if (result) await get().fetchGames(false);
    },

    deleteGame: async (id: number) => {
      const success = await GameActions.deleteGame(id);
      if (success) {
        set({ games: get().games.filter((game: Game) => game.id !== id) });
      }
    },

    searchByName: async (name: string) => {
      const games = await executeAsyncOperation(
        () => GameActions.searchByName(name),
        get(),
        `Error searching for games with name: "${name}"`
      );
      if (games) set({ games, hasSearched: true });
    },

    searchByGenre: async (genreName: string) => {
      const games = await executeAsyncOperation(
        () => GameActions.searchByGenre(genreName),
        get(),
        `Error searching for genre: ${genreName}`
      );
      if (games) set({ games, hasSearched: true });
    },

    showAllGames: async () => {
      const games = await executeAsyncOperation(
        () => GameActions.showAllGames(),
        get(),
        "Error fetching games"
      );
      if (games) set({ games, hasSearched: false });
    },
  }))
);
