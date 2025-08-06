'use client'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore';
import { useGenreStore } from '@/stores/genreStore';
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

export default function Search() {
  const [searchItem, setSearchItem] = useState<'Name' | 'Genre'>('Name');
  const [query, setQuery] = useState('');
  const { searchByName, searchByGenre, fetchGames } = useGameStore();
  const { genres, fetchGenres } = useGenreStore();

  useEffect(() => {
    fetchGenres().then(() => {
      const firstGenre = useGenreStore.getState().genres[0];
      // Set the first genre when switching to Genre search
      if (searchItem === 'Genre' && firstGenre) {
        setQuery(firstGenre.name);
      }
    });
  }, [fetchGenres, searchItem]); // Remove query from dependencies

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      await fetchGames();
      return;
    }

    // Search by Name
    if (searchItem === 'Name') {
      const gameName = query.trim();
      if (!gameName) {
        toast.error('Please enter a game name to search.');
        return;
      }
      await searchByName(gameName);
      setQuery('');
    }

    // Search by Genre
    if (searchItem === 'Genre') {
      const genreName = query.trim();

      if (genreName === 'all') {
        await fetchGames();
        return;
      }
      await searchByGenre(genreName);
    }

  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Search for your favorite games</h2>

      <div className="flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-gray-100 border px-6 py-2 whitespace-nowrap rounded-md text-sm cursor-pointer hover:bg-gray-200">
            Search By
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => {
                setSearchItem('Name');
                setQuery(''); // Clear query when switching to Name search
              }}
              className={searchItem === 'Name' ? 'bg-gray-100' : ''}
            >
              Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setSearchItem('Genre');
                setQuery(''); // Clear query when switching to Genre search
              }}
              className={searchItem === 'Genre' ? 'bg-gray-100' : ''}
            >
              Genre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <form className="flex items-center gap-2" onSubmit={handleSearch}>
          {searchItem === 'Name' ? (
            <Input
              type="text"
              placeholder="Enter game name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full max-w-sm"
            />
          ) : (
            <select
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 border rounded-md text-sm w-full max-w-sm"
            >
              {genres.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
              <option value="all">
                All Genres
              </option>
            </select>
          )}

          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>
    </div>
  );
}
