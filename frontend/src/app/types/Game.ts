import { Genre } from './Genre';

export interface Game {
    id: number;
    name: string;
    genreId: number;
    genre?: string;
    price: number;
    releaseDate: Date;
}