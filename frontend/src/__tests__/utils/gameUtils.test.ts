import { GameUtils } from "@/utils/gameUtils";
import { UpdateGame } from "@/app/types/UpdateGame";

describe("GameUtils", () => {
  describe("prepareGamePayload", () => {
    it("should prepare game payload correctly", () => {
      const gameData: UpdateGame = {
        id: 1,
        name: "Test Game",
        genreId: 2,
        price: 59.99,
        releaseDate: new Date("2023-01-01"),
      };

      const result = GameUtils.prepareGamePayload(gameData, 3);

      expect(result).toEqual({
        id: 1,
        name: "Test Game",
        genreId: 3, // Should use the provided genreId
        price: 59.99,
        releaseDate: gameData.releaseDate,
      });
    });

    it("should handle game without id", () => {
      const gameData: UpdateGame = {
        name: "New Game",
        genreId: 1,
        price: 49.99,
        releaseDate: new Date("2024-01-01"),
      };

      const result = GameUtils.prepareGamePayload(gameData, 2);

      expect(result).toEqual({
        id: undefined,
        name: "New Game",
        genreId: 2,
        price: 49.99,
        releaseDate: gameData.releaseDate,
      });
    });
  });

  describe("validateGenreId", () => {
    it("should not throw error for valid genre id", () => {
      expect(() => GameUtils.validateGenreId(1)).not.toThrow();
      expect(() => GameUtils.validateGenreId(999)).not.toThrow();
    });

    it("should throw error for invalid genre id", () => {
      expect(() => GameUtils.validateGenreId(0)).toThrow(
        "Genre ID is required"
      );
      expect(() => GameUtils.validateGenreId(null as any)).toThrow(
        "Genre ID is required"
      );
      expect(() => GameUtils.validateGenreId(undefined as any)).toThrow(
        "Genre ID is required"
      );
    });
  });

  describe("logGameOperation", () => {
    it("should log game operation", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const gameData = { id: 1, name: "Test Game" };
      GameUtils.logGameOperation("CREATE", gameData);

      expect(consoleSpy).toHaveBeenCalledWith("CREATE:", gameData);

      consoleSpy.mockRestore();
    });

    it("should handle different operation types", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      GameUtils.logGameOperation("UPDATE", { id: 1 });
      GameUtils.logGameOperation("DELETE", { id: 2 });

      expect(consoleSpy).toHaveBeenCalledWith("UPDATE:", { id: 1 });
      expect(consoleSpy).toHaveBeenCalledWith("DELETE:", { id: 2 });

      consoleSpy.mockRestore();
    });
  });
});
