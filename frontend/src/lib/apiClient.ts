import { Game } from '@/app/types/Game';
import { UpdateGame } from '@/app/types/UpdateGame';
import { Genre } from '@/app/types/Genre';
import { error } from 'node:console';

const API_BASE = 'http://localhost:5179';

// Get all games
export async function getAll() : Promise<Game[]> {    
    const res = await fetch(`${API_BASE}/games`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error('Failed to fetch games');
    }
    return data.map((game: any) => ({
        ...game,
        releaseDate: new Date(game.releaseDate),
    }));
}

// Get all genres
export async function getAllGenres(): Promise<Genre[]> {
  const res = await fetch(`${API_BASE}/genres`);
  if (!res.ok) {
    throw new Error('Failed to fetch genres');
  }
  return res.json();
}

// Get a game by ID
export async function getById(id: number): Promise<Game> {
  const res = await fetch(`${API_BASE}/games/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch game with ID ${id}`);
  }
  const game = await res.json();
  return {
    ...game,
    releaseDate: new Date(game.releaseDate),
  };
}

// Create a new game
export async function create(game: Game): Promise<Game> {
  // Map to backend field names
  const gameForApi = {
    Name: game.name,
    GenreId: game.genreId,
    Price: game.price,
    ReleaseDate: game.releaseDate instanceof Date 
      ? game.releaseDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
      : game.releaseDate
  };

  const res = await fetch(`${API_BASE}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameForApi),
  });
  if (!res.ok) {
    throw new Error('Failed to create game');
  }
  const createdGame = await res.json();
  return {
    ...createdGame,
    releaseDate: new Date(createdGame.releaseDate),
  };
}

// Update an existing game
export async function update(game: UpdateGame): Promise<Game> {
  // console.log('Updating game:', game);
  try {
    // Convert Date to DateOnly format (YYYY-MM-DD) and map to backend field names
    const gameForApi = {
      Name: game.name,
      GenreId: game.genreId,
      Price: game.price,
      ReleaseDate: game.releaseDate instanceof Date 
        ? game.releaseDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
        : game.releaseDate
    };
    
    const res = await fetch(`${API_BASE}/games/${game.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameForApi),
    });

    if (!res.ok) {
      let errorBody: string;
      try {
        errorBody = JSON.stringify(await res.clone().json());
      } catch {
        errorBody = await res.clone().text();
      }
      console.error(`Update failed: status=${res.status}, body=${errorBody}`);
      throw new Error(`Failed to update game with ID ${game.id}: ${errorBody}`);
    }

    // PUT endpoint returns 204 No Content, so we need to return the updated game data
    // We'll return the original game data with the updated values
    if (!game.id) {
      throw new Error('Game ID is required for update');
    }
    
    return {
      id: game.id,
      name: gameForApi.Name,
      genreId: gameForApi.GenreId,
      price: gameForApi.Price,
      releaseDate: game.releaseDate,
    } as Game;
  } catch (err) {
    console.error('Error in update()', err);
    throw err;
  }
}

export async function remove(Id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/games/${Id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete game with ID ${Id}`);
  }
  return res.ok;
}
