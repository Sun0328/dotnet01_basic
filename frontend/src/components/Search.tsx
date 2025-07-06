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

export default function Search() {
  const [searchItem, setSearchItem] = useState<'Id' | 'Genre'>('Id');
  const [query, setQuery] = useState('');
  const { searchById, searchByGenre , fetchGames } = useGameStore();
  const { genres, fetchGenres } = useGenreStore();

  useEffect(() => {
  fetchGenres().then(() => {
      const firstGenre = useGenreStore.getState().genres[0];
      if (searchItem === 'Genre' && firstGenre) {
      setQuery(firstGenre.name);
      }
  });
  }, [fetchGenres, searchItem]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Search by Id
    if (searchItem === 'Id') {
        if (!query.trim()) {
            await fetchGames();
            return;
        }

      const id = parseInt(query);
      if (isNaN(id)) {
        alert('Please enter a valid numeric ID.');
        return;
      }
      await searchById(id);
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
          <DropdownMenuTrigger className="border px-6 py-2 whitespace-nowrap rounded-md text-sm">
            Search By
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
                onSelect={() => setSearchItem('Id')}
                className={searchItem === 'Id' ? 'bg-gray-100' : ''}
            >
                Id
            </DropdownMenuItem>
            <DropdownMenuItem
                onSelect={() => setSearchItem('Genre')}
                className={searchItem === 'Id' ? '' : 'bg-gray-100'}
            >
                Genre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <form className="flex items-center gap-2" onSubmit={handleSearch}>
          {searchItem === 'Id' ? (
            <Input
              type="number"
              placeholder="Enter ID"
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
