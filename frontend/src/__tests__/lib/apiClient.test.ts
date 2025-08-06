import "@testing-library/jest-dom";
import {
  getAll,
  getAllGenres,
  getById,
  update,
  remove,
  add,
} from "@/lib/apiClient";
import { UpdateGame } from "@/app/types/UpdateGame";
import { Genre } from "@/app/types/Genre";

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("API Client", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("Games API", () => {
    describe("getAll", () => {
      it("should fetch all games successfully", async () => {
        const mockGames = [
          {
            id: 1,
            name: "Cyberpunk 2077",
            genre: "RPG",
            price: 59.99,
            releaseDate: "2020-12-10",
          },
          {
            id: 2,
            name: "The Witcher 3",
            genre: "RPG",
            price: 39.99,
            releaseDate: "2015-05-19",
          },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockGames,
        } as Response);

        const result = await getAll();

        expect(mockFetch).toHaveBeenCalledWith("http://localhost:5179/games");
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("Cyberpunk 2077");
        expect(result[0].releaseDate).toBeInstanceOf(Date);
        expect(result[1].name).toBe("The Witcher 3");
        expect(result[1].releaseDate).toBeInstanceOf(Date);
      });

      it("should throw error when fetch fails", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          json: async () => ({}),
        } as Response);

        await expect(getAll()).rejects.toThrow("Failed to fetch games");
      });

      it("should handle empty response", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        } as Response);

        const result = await getAll();

        expect(result).toEqual([]);
      });
    });

    describe("getById", () => {
      it("should fetch game by id successfully", async () => {
        const mockGame = {
          id: 1,
          name: "Cyberpunk 2077",
          genreId: 1,
          price: 59.99,
          releaseDate: "2020-12-10",
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockGame,
        } as Response);

        const result = await getById(1);

        expect(mockFetch).toHaveBeenCalledWith("http://localhost:5179/games/1");
        expect(result?.name).toBe("Cyberpunk 2077");
        expect(result?.releaseDate).toBeInstanceOf(Date);
        expect(result?.id).toBe(1);
      });

      it("should return null when game not found", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
        } as Response);

        const result = await getById(999);

        expect(result).toBeNull();
      });

      it("should throw error for server errors", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
        } as Response);

        await expect(getById(1)).rejects.toThrow(
          "Failed to fetch game with ID 1"
        );
      });
    });

    describe("add", () => {
      it("should add new game successfully", async () => {
        const newGame: UpdateGame = {
          name: "New Awesome Game",
          genreId: 1,
          price: 49.99,
          releaseDate: new Date("2024-01-01"),
        };

        const mockResponse = {
          id: 3,
          name: "New Awesome Game",
          genreId: 1,
          price: 49.99,
          releaseDate: "2024-01-01",
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await add(newGame);

        expect(mockFetch).toHaveBeenCalledWith("http://localhost:5179/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "New Awesome Game",
            genreId: 1,
            price: 49.99,
            releaseDate: "2024-01-01",
          }),
        });
        expect(result.name).toBe("New Awesome Game");
        expect(result.releaseDate).toBeInstanceOf(Date);
        expect(result.id).toBe(3);
      });

      it("should throw error when add fails with validation error", async () => {
        const newGame: UpdateGame = {
          name: "",
          genreId: 1,
          price: -10,
          releaseDate: new Date("2024-01-01"),
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          clone: () => ({
            json: async () => ({ error: "Validation failed" }),
            text: async () => "Validation failed",
          }),
        } as any);

        await expect(add(newGame)).rejects.toThrow("Failed to add game");
      });

      it("should handle server errors during add", async () => {
        const newGame: UpdateGame = {
          name: "Test Game",
          genreId: 1,
          price: 49.99,
          releaseDate: new Date("2024-01-01"),
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          clone: () => ({
            json: async () => ({ error: "Internal server error" }),
            text: async () => "Internal server error",
          }),
        } as any);

        await expect(add(newGame)).rejects.toThrow("Failed to add game");
      });
    });

    describe("update", () => {
      it("should update game successfully", async () => {
        const updateGame: UpdateGame = {
          id: 1,
          name: "Updated Cyberpunk 2077",
          genreId: 1,
          price: 29.99,
          releaseDate: new Date("2020-12-10"),
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 204,
        } as Response);

        const result = await update(updateGame);

        expect(mockFetch).toHaveBeenCalledWith(
          "http://localhost:5179/games/1",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Updated Cyberpunk 2077",
              genreId: 1,
              price: 29.99,
              releaseDate: "2020-12-10",
            }),
          }
        );
        expect(result.name).toBe("Updated Cyberpunk 2077");
        expect(result.price).toBe(29.99);
      });

      it("should throw error when game not found for update", async () => {
        const updateGame: UpdateGame = {
          id: 999,
          name: "Non-existent Game",
          genreId: 1,
          price: 69.99,
          releaseDate: new Date("2024-01-01"),
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          clone: () => ({
            json: async () => ({ error: "Game not found" }),
            text: async () => "Game not found",
          }),
        } as any);

        await expect(update(updateGame)).rejects.toThrow(
          "Failed to update game with ID 999"
        );
      });

      it("should throw error when update data is invalid", async () => {
        const updateGame: UpdateGame = {
          id: 1,
          name: "",
          genreId: 999,
          price: -50,
          releaseDate: new Date("2024-01-01"),
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          clone: () => ({
            json: async () => ({ error: "Invalid data" }),
            text: async () => "Invalid data",
          }),
        } as any);

        await expect(update(updateGame)).rejects.toThrow(
          "Failed to update game with ID 1"
        );
      });
    });

    describe("remove", () => {
      it("should delete game successfully", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 204,
        } as Response);

        const result = await remove(1);

        expect(mockFetch).toHaveBeenCalledWith(
          "http://localhost:5179/games/1",
          {
            method: "DELETE",
          }
        );
        expect(result).toBe(true);
      });

      it("should throw error when delete fails", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
        } as Response);

        await expect(remove(999)).rejects.toThrow(
          "Failed to delete game with ID 999"
        );
      });

      it("should handle server errors during delete", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
        } as Response);

        await expect(remove(1)).rejects.toThrow(
          "Failed to delete game with ID 1"
        );
      });
    });
  });

  describe("Genres API", () => {
    describe("getAllGenres", () => {
      it("should fetch all genres successfully", async () => {
        const mockGenres: Genre[] = [
          { id: 1, name: "RPG" },
          { id: 2, name: "Action" },
          { id: 3, name: "Adventure" },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockGenres,
        } as Response);

        const result = await getAllGenres();

        expect(mockFetch).toHaveBeenCalledWith("http://localhost:5179/genres");
        expect(result).toEqual(mockGenres);
        expect(result).toHaveLength(3);
        expect(result[0].name).toBe("RPG");
      });

      it("should throw error when genres fetch fails", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
        } as Response);

        await expect(getAllGenres()).rejects.toThrow("Failed to fetch genres");
      });

      it("should handle empty genres response", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        } as Response);

        const result = await getAllGenres();

        expect(result).toEqual([]);
      });
    });
  });

  describe("Network Error Handling", () => {
    it("should handle network errors for getAll", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getAll()).rejects.toThrow("Network error");
    });

    it("should handle network errors for getById", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Connection timeout"));

      await expect(getById(1)).rejects.toThrow("Connection timeout");
    });

    it("should handle network errors for getAllGenres", async () => {
      mockFetch.mockRejectedValueOnce(new Error("DNS resolution failed"));

      await expect(getAllGenres()).rejects.toThrow("DNS resolution failed");
    });
  });

  describe("Data Transformation", () => {
    it("should correctly transform date strings to Date objects in getAll", async () => {
      const mockGames = [
        {
          id: 1,
          name: "Test Game",
          genre: "RPG",
          price: 59.99,
          releaseDate: "2023-12-25",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGames,
      } as Response);

      const result = await getAll();

      expect(result[0].releaseDate).toBeInstanceOf(Date);
      expect(result[0].releaseDate.getFullYear()).toBe(2023);
      expect(result[0].releaseDate.getMonth()).toBe(11); // December is month 11
      expect(result[0].releaseDate.getDate()).toBe(25);
    });

    it("should correctly transform Date objects to strings in add", async () => {
      const testDate = new Date("2024-06-15");
      const newGame: UpdateGame = {
        name: "Date Test Game",
        genreId: 1,
        price: 49.99,
        releaseDate: testDate,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          name: "Date Test Game",
          genreId: 1,
          price: 49.99,
          releaseDate: "2024-06-15",
        }),
      } as Response);

      await add(newGame);

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:5179/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Date Test Game",
          genreId: 1,
          price: 49.99,
          releaseDate: "2024-06-15",
        }),
      });
    });
  });
});
