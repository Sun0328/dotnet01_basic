using GameStore.Api.Entities;
using GameStore.Api.Dtos;
using GameStore.Api.Mapping;

namespace GameStore.Api.Tests;

public class GameTests
{
    [Fact]
    // Test that a Game entity can be created 
    // with all properties set correctly.
    public void Game_ShouldCreateWithValidProperties()
    {
        // Arrange
        var game = new Game
        {
            Id = 1,
            Name = "Test Game",
            GenreId = 1,
            Price = 59.99m,
            ReleaseDate = new DateOnly(2023, 1, 1)
        };

        // Assert
        Assert.Equal(1, game.Id);
        Assert.Equal("Test Game", game.Name);
        Assert.Equal(1, game.GenreId);
        Assert.Equal(59.99m, game.Price);
        Assert.Equal(new DateOnly(2023, 1, 1), game.ReleaseDate);
    }

    [Fact]
    // Test that a CreateGameDto can be mapped to a Game entity.
    public void CreateGameDto_ShouldMapToEntity()
    {
        // Arrange
        var createGameDto = new CreateGameDto(
            Name: "New Game",
            GenreId: 2,
            Price: 49.99m,
            ReleaseDate: new DateOnly(2024, 6, 1)
        );

        // Act
        var game = createGameDto.ToEntity();

        // Assert
        Assert.Equal("New Game", game.Name);
        Assert.Equal(2, game.GenreId);
        Assert.Equal(49.99m, game.Price);
        Assert.Equal(new DateOnly(2024, 6, 1), game.ReleaseDate);
    }

    [Fact]
    // Test that an UpdateGameDto can be mapped 
    // to a Game entity with an ID.
    public void UpdateGameDto_ShouldMapToEntityWithId()
    {
        // Arrange
        var updateGameDto = new UpdateGameDto(
            Name: "Updated Game",
            GenreId: 3,
            Price: 69.99m,
            ReleaseDate: new DateOnly(2024, 12, 1)
        );
        var id = 5;

        // Act
        var game = updateGameDto.ToEntity(id);

        // Assert
        Assert.Equal(id, game.Id);
        Assert.Equal("Updated Game", game.Name);
        Assert.Equal(3, game.GenreId);
        Assert.Equal(69.99m, game.Price);
        Assert.Equal(new DateOnly(2024, 12, 1), game.ReleaseDate);
    }

    [Fact]
    // Test that a Game entity can be mapped to a GameSummaryDto.
    public void Game_ShouldMapToGameSummaryDto()
    {
        // Arrange
        var game = new Game
        {
            Id = 1,
            Name = "Test Game",
            GenreId = 1,
            Price = 59.99m,
            ReleaseDate = new DateOnly(2023, 1, 1),
            Genre = new Genre { Id = 1, Name = "Action" }
        };

        // Act
        var gameSummaryDto = game.ToGameSummaryDto();

        // Assert
        Assert.Equal(1, gameSummaryDto.Id);
        Assert.Equal("Test Game", gameSummaryDto.Name);
        Assert.Equal("Action", gameSummaryDto.Genre);
        Assert.Equal(59.99m, gameSummaryDto.Price);
        Assert.Equal(new DateOnly(2023, 1, 1), gameSummaryDto.ReleaseDate);
    }

    [Fact]
    // Test that a Game entity can be mapped to a GameDetailsDto.
    public void Game_ShouldMapToGameDetailsDto()
    {
        // Arrange
        var game = new Game
        {
            Id = 1,
            Name = "Test Game",
            GenreId = 1,
            Price = 59.99m,
            ReleaseDate = new DateOnly(2023, 1, 1)
        };

        // Act
        var gameDetailsDto = game.ToGameDetailsDto();

        // Assert
        Assert.Equal(1, gameDetailsDto.Id);
        Assert.Equal("Test Game", gameDetailsDto.Name);
        Assert.Equal(1, gameDetailsDto.GenreId);
        Assert.Equal(59.99m, gameDetailsDto.Price);
        Assert.Equal(new DateOnly(2023, 1, 1), gameDetailsDto.ReleaseDate);
    }
} 