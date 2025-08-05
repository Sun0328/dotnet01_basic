import { Game } from "@/app/types/Game";
import { UpdateGame } from "@/app/types/UpdateGame";
import { getAll, remove, update, add } from "@/lib/apiClient";
import { GameUtils } from "@/utils/gameUtils";
import { useGenreStore } from "../genreStore";
import { toast } from "sonner";

/**
 * Game Actions - All game-related business logic
 */
export class GameActions {
  /**
   * Fetch all games
   */
  static async fetchGames(showSuccessToast = true): Promise<Game[]> {
    const data = await getAll();
    const games = data.map((game) => ({
      ...game,
      releaseDate: new Date(game.releaseDate),
    }));

    if (showSuccessToast) {
      toast.success("All Games fetched successfully");
    }
    return games;
  }

  /**
   * Add a new game
   */
  static async addGame(newGame: UpdateGame): Promise<Game> {
    GameUtils.logGameOperation("Received new game from store", newGame);

    const genreId =
      newGame.genreId ||
      (newGame.genre
        ? useGenreStore.getState().getGenreIdByName(newGame.genre)
        : 0);

    GameUtils.validateGenreId(genreId);

    const payload = GameUtils.prepareGamePayload(newGame, genreId);
    GameUtils.logGameOperation("Sending payload to API", payload);

    const savedGame = await add(payload);
    toast.success(`Game "${savedGame.name}" added successfully`);
    return savedGame;
  }

  /**
   * Update an existing game
   */
  static async updateGame(updatedGame: UpdateGame): Promise<Game> {
    const genreId = updatedGame.genre
      ? useGenreStore.getState().getGenreIdByName(updatedGame.genre)
      : updatedGame.genreId || 0;

    const payload = GameUtils.prepareGamePayload(updatedGame, genreId);
    GameUtils.logGameOperation("Updating game", payload);

    const savedGame = await update(payload);
    toast.success(`Game ID ${savedGame.id} updated successfully`);
    return savedGame;
  }

  /**
   * Delete a game
   */
  static async deleteGame(id: number): Promise<boolean> {
    const success = await remove(id);
    if (success) {
      toast.success(`Game ID ${id} deleted successfully`);
    } else {
      toast.error("Failed to delete game on server");
    }
    return success;
  }

  /**
   * Search games by name
   */
  static async searchByName(name: string): Promise<Game[]> {
    const allGames = await this.fetchGames(false);
    const matchedGames = allGames.filter((game) =>
      game.name.toLowerCase().includes(name.toLowerCase())
    );

    if (matchedGames.length === 0) {
      toast.error(`No games found with name containing: "${name}"`);
    } else {
      toast.success(`Found ${matchedGames.length} game(s) matching: "${name}"`);
    }

    return matchedGames;
  }

  /**
   * Search games by genre
   */
  static async searchByGenre(genreName: string): Promise<Game[]> {
    const allGames = await this.fetchGames(false);
    const matchedGames = allGames.filter(
      (game) => game.genre?.toLowerCase() === genreName.toLowerCase()
    );

    if (matchedGames.length === 0) {
      toast.error(`No games found for genre: ${genreName}`);
    } else {
      toast.success(`Games for genre: ${genreName} fetched successfully`);
    }

    return matchedGames;
  }

  /**
   * Show all games
   */
  static async showAllGames(): Promise<Game[]> {
    const games = await this.fetchGames(false);
    toast.success("Showing all games");
    return games;
  }
}
