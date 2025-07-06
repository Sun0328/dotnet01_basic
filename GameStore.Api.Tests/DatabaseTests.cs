using Microsoft.EntityFrameworkCore;
using GameStore.Api.Data;
using GameStore.Api.Entities;

namespace GameStore.Api.Tests;

public class DatabaseTests : IDisposable
{
    private readonly GameStoreContext _context;

    public DatabaseTests()
    {
        // Use in-memory database for testing
        var options = new DbContextOptionsBuilder<GameStoreContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new GameStoreContext(options);
        _context.Database.EnsureCreated();
    }

    [Fact]
    public async Task AddGame_ShouldSaveToDatabase()
    {
        // Arrange
        var game = new Game
        {
            Name = "Test Game",
            GenreId = 1,
            Price = 59.99m,
            ReleaseDate = new DateOnly(2023, 1, 1)
        };

        // Act
        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        // Assert
        var savedGame = await _context.Games.FirstOrDefaultAsync(g => g.Name == "Test Game");
        Assert.NotNull(savedGame);
        Assert.Equal("Test Game", savedGame.Name);
        Assert.Equal(59.99m, savedGame.Price);
    }

    [Fact]
    public async Task AddGenre_ShouldSaveToDatabase()
    {
        // Arrange
        var genre = new Genre
        {
            Name = "Test Genre"
        };

        // Act
        _context.Genres.Add(genre);
        await _context.SaveChangesAsync();

        // Assert
        var savedGenre = await _context.Genres.FirstOrDefaultAsync(g => g.Name == "Test Genre");
        Assert.NotNull(savedGenre);
        Assert.Equal("Test Genre", savedGenre.Name);
    }

    [Fact]
    public async Task UpdateGame_ShouldModifyInDatabase()
    {
        // Arrange
        var game = new Game
        {
            Name = "Original Name",
            GenreId = 1,
            Price = 49.99m,
            ReleaseDate = new DateOnly(2023, 1, 1)
        };

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        // Act
        game.Name = "Updated Name";
        game.Price = 69.99m;
        await _context.SaveChangesAsync();

        // Assert
        var updatedGame = await _context.Games.FirstOrDefaultAsync(g => g.Id == game.Id);
        Assert.NotNull(updatedGame);
        Assert.Equal("Updated Name", updatedGame.Name);
        Assert.Equal(69.99m, updatedGame.Price);
    }

    [Fact]
    public async Task DeleteGame_ShouldRemoveFromDatabase()
    {
        // Arrange
        var game = new Game
        {
            Name = "Game to Delete",
            GenreId = 1,
            Price = 49.99m,
            ReleaseDate = new DateOnly(2023, 1, 1)
        };

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        var gameId = game.Id;

        // Act
        _context.Games.Remove(game);
        await _context.SaveChangesAsync();

        // Assert
        var deletedGame = await _context.Games.FirstOrDefaultAsync(g => g.Id == gameId);
        Assert.Null(deletedGame);
    }

    [Fact]
    public async Task GetGamesWithGenre_ShouldIncludeGenreData()
    {
        // Arrange
        var genre = new Genre { Name = "Action" };
        _context.Genres.Add(genre);
        await _context.SaveChangesAsync();

        var game = new Game
        {
            Name = "Action Game",
            GenreId = genre.Id,
            Price = 59.99m,
            ReleaseDate = new DateOnly(2023, 1, 1)
        };

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        // Act
        var gameWithGenre = await _context.Games
            .Include(g => g.Genre)
            .FirstOrDefaultAsync(g => g.Id == game.Id);

        // Assert
        Assert.NotNull(gameWithGenre);
        Assert.NotNull(gameWithGenre.Genre);
        Assert.Equal("Action", gameWithGenre.Genre.Name);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
} 