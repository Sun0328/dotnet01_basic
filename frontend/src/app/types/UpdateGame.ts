export interface UpdateGame {
    id?: number;
    name: string;
    genreId?: number;
    genre?: string;
    price: number;
    releaseDate: Date;
}