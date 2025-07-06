import { create } from 'zustand';
import { Genre } from '@/app/types/Genre';
import { getAllGenres } from '@/app/lib/apiClient';

interface GenreState {
  genres: Genre[];
  loading: boolean;
  error: string | null;
  fetchGenres: () => Promise<void>;
  getGenreNameById: (id: number) => string;
}

export const useGenreStore = create<GenreState>((set, get) => ({
  genres: [],
  loading: false,
  error: null,

  fetchGenres: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllGenres();
      set({ genres: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      set({ error: 'Failed to fetch genres', loading: false });
    }
  },

  getGenreNameById: (id: number) => {
    const genre = get().genres.find((g) => g.id === id);
    return genre ? genre.name : '—';
  },
}));
