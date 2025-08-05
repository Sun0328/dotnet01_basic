import { Genre } from "@/app/types/Genre";
import { getAllGenres } from "@/lib/apiClient";

/**
 * Genre Actions - All genre-related business logic
 */
export class GenreActions {
  /**
   * Fetch all genres
   */
  static async fetchGenres(): Promise<Genre[]> {
    return await getAllGenres();
  }

  /**
   * Find genre name by ID
   */
  static findGenreNameById(genres: Genre[], id: number): string {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : "—";
  }

  /**
   * Find genre ID by name
   */
  static findGenreIdByName(genres: Genre[], name: string): number {
    const genre = genres.find(
      (g) => g.name.toLowerCase() === name.toLowerCase()
    );
    return genre ? genre.id : 0;
  }
}
