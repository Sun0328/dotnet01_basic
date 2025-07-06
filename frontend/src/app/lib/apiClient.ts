import { Game } from '../types/Game';
import { Genre } from '../types/Genre';

const API_BASE = 'http://localhost:5179';

// Get all games
export async function getAll() : Promise<Game[]> {    
    const res = await fetch(`${API_BASE}/games`);
    const data = await res.json();
    return data.map((game: any) => ({
        ...game,
        ReleaseDate: new Date(game.releaseDate),
    }));
}

// Get all genres
export async function getAllGenres(): Promise<Genre[]> {
  const res = await fetch(`${API_BASE}/genres`);
  return res.json();
}

// Get a game by ID
export async function getById(id: number): Promise<Game> {
  const res = await fetch(`${API_BASE}/games/${id}`);
  return res.json();
}

// Create a new game
export async function create(Game: Game): Promise<Game> {
  const res = await fetch(`${API_BASE}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Game),
  });
  return res.json();
}

// Update an existing game
export async function update(Game: Game): Promise<Game> {
  console.log('Updating game:', Game);
  
  const res = await fetch(`${API_BASE}/games/${Game.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Game),
  });
  return res.json();
}

export async function remove(Id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/games/${Id}`, {
    method: 'DELETE',
  });
  return res.ok;
}
