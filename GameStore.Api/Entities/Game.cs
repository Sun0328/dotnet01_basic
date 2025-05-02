namespace GameStore.Api.Entities;

public class Game
{
    public int Id { get; set; }

    public required string Name { get; set; }

    // Add association attribute related to Genre
    
    public int GenreId { get; set; }

    public Genre? Genre { get; set; } // ? means it's nullable

    public decimal Price { get; set; }

    public DateOnly ReleaseDate { get; set; }
}
