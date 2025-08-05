import { UpdateGame } from "@/app/types/UpdateGame";

/**
 * Game utility functions
 */
export class GameUtils {
  /**
   * Prepare game data for API submission
   */
  static prepareGamePayload(gameData: UpdateGame, genreId: number): UpdateGame {
    return {
      id: gameData.id,
      name: gameData.name,
      genreId: genreId,
      price: gameData.price,
      releaseDate: gameData.releaseDate,
    };
  }

  /**
   * Validate genre ID
   */
  static validateGenreId(genreId: number): void {
    if (!genreId) {
      throw new Error("Genre ID is required");
    }
  }

  /**
   * Log game operation for debugging
   */
  static logGameOperation(operation: string, gameData: any): void {
    console.log(`${operation}:`, gameData);
  }
}
