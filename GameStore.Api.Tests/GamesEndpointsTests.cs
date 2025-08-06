using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using System.Net;
using GameStore.Api.Data;
using GameStore.Api.Entities;
using GameStore.Api.Dtos;

namespace GameStore.Api.Tests;

public class GamesEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public GamesEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove the existing DbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<GameStoreContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                // Add in-memory database for testing
                services.AddDbContext<GameStoreContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDb");
                });
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetGames_ShouldReturnEmptyList_WhenNoGamesExist()
    {
        // Act
        var response = await _client.GetAsync("/games");
        var games = await response.Content.ReadFromJsonAsync<List<GameSummaryDto>>();

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.NotNull(games);
        Assert.Empty(games);
    }

    [Fact]
    public async Task GetGames_ShouldReturnGamesList_WhenGamesExist()
    {
        // Arrange
        await SeedTestData();

        // Act
        var response = await _client.GetAsync("/games");
        var games = await response.Content.ReadFromJsonAsync<List<GameSummaryDto>>();

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.NotNull(games);
        Assert.NotEmpty(games);
        Assert.Contains(games, g => g.Name == "Test Game 1");
    }

    [Fact]
    public async Task GetGame_ShouldReturnGame_WhenGameExists()
    {
        // Arrange
        var gameId = await SeedTestData();

        // Act
        var response = await _client.GetAsync($"/games/{gameId}");
        var game = await response.Content.ReadFromJsonAsync<GameDetailsDto>();

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.NotNull(game);
        Assert.Equal("Test Game 1", game.Name);
        Assert.Equal(59.99m, game.Price);
    }

    [Fact]
    public async Task GetGame_ShouldReturnNotFound_WhenGameDoesNotExist()
    {
        // Act
        var response = await _client.GetAsync("/games/999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateGame_ShouldCreateGame_WithValidData()
    {
        // Arrange
        await SeedGenres();
        var createGameDto = new CreateGameDto(
            Name: "New Test Game",
            GenreId: 1,
            Price: 49.99m,
            ReleaseDate: new DateOnly(2024, 1, 1)
        );

        // Act
        var response = await _client.PostAsJsonAsync("/games", createGameDto);
        var createdGame = await response.Content.ReadFromJsonAsync<GameDetailsDto>();

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(createdGame);
        Assert.Equal("New Test Game", createdGame.Name);
        Assert.Equal(49.99m, createdGame.Price);
        Assert.True(createdGame.Id > 0);
    }

    [Fact]
    public async Task UpdateGame_ShouldUpdateGame_WhenGameExists()
    {
        // Arrange
        var gameId = await SeedTestData();
        var updateGameDto = new UpdateGameDto(
            Name: "Updated Game Name",
            GenreId: 1,
            Price: 79.99m,
            ReleaseDate: new DateOnly(2024, 6, 1)
        );

        // Act
        var response = await _client.PutAsJsonAsync($"/games/{gameId}", updateGameDto);

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Verify the update
        var getResponse = await _client.GetAsync($"/games/{gameId}");
        var updatedGame = await getResponse.Content.ReadFromJsonAsync<GameDetailsDto>();
        Assert.NotNull(updatedGame);
        Assert.Equal("Updated Game Name", updatedGame.Name);
        Assert.Equal(79.99m, updatedGame.Price);
    }

    [Fact]
    public async Task UpdateGame_ShouldReturnNotFound_WhenGameDoesNotExist()
    {
        // Arrange
        var updateGameDto = new UpdateGameDto(
            Name: "Updated Game",
            GenreId: 1,
            Price: 79.99m,
            ReleaseDate: new DateOnly(2024, 6, 1)
        );

        // Act
        var response = await _client.PutAsJsonAsync("/games/999", updateGameDto);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteGame_ShouldDeleteGame_WhenGameExists()
    {
        // Arrange
        var gameId = await SeedTestData();

        // Act
        var response = await _client.DeleteAsync($"/games/{gameId}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Verify deletion
        var getResponse = await _client.GetAsync($"/games/{gameId}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteGame_ShouldReturnNoContent_WhenGameDoesNotExist()
    {
        // Act
        var response = await _client.DeleteAsync("/games/999");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    private async Task<int> SeedTestData()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<GameStoreContext>();

        // Clear existing data
        context.Games.RemoveRange(context.Games);
        context.Genres.RemoveRange(context.Genres);
        await context.SaveChangesAsync();

        // Add test genre
        var genre = new Genre { Name = "Action" };
        context.Genres.Add(genre);
        await context.SaveChangesAsync();

        // Add test game
        var game = new Game
        {
            Name = "Test Game 1",
            GenreId = genre.Id,
            Price = 59.99m,
            ReleaseDate = new DateOnly(2023, 1, 1)
        };

        context.Games.Add(game);
        await context.SaveChangesAsync();

        return game.Id;
    }

    private async Task SeedGenres()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<GameStoreContext>();

        if (!context.Genres.Any())
        {
            context.Genres.AddRange(
                new Genre { Name = "Action" },
                new Genre { Name = "Adventure" },
                new Genre { Name = "RPG" }
            );
            await context.SaveChangesAsync();
        }
    }
}