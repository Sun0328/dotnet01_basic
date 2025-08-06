import { create } from "zustand";
import { Genre } from "@/app/types/Genre";
import {
  createAsyncStore,
  AsyncStoreState,
  AsyncStoreActions,
  executeAsyncOperation,
} from "./base/createAsyncStore";
import { GenreActions } from "./actions/genreActions";

interface GenreState extends AsyncStoreState, AsyncStoreActions {
  genres: Genre[];
  fetchGenres: () => Promise<void>;
  getGenreNameById: (id: number) => string;
  getGenreIdByName: (name: string) => number;
}

export const useGenreStore = create<GenreState>(
  createAsyncStore((set, get) => ({
    genres: [],

    fetchGenres: async () => {
      const genres = await executeAsyncOperation(
        () => GenreActions.fetchGenres(),
        get(),
        "Failed to fetch genres"
      );
      if (genres) set({ genres });
    },

    getGenreNameById: (id: number): string => {
      return GenreActions.findGenreNameById(get().genres, id);
    },

    getGenreIdByName: (name: string): number => {
      return GenreActions.findGenreIdByName(get().genres, name);
    },
  }))
);
