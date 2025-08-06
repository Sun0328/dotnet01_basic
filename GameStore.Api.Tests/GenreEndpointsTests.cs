using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using GameStore.Api.Data;
using GameStore.Api.Entities;
using GameStore.Api.Dtos;

namespace GameStore.Api.Tests;

public class GenreEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public GenreEndpointsTests(WebApplicationFactory<Program> factory)
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
                    options.UseInMemoryDatabase("TestGenreDb");
                });
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetGenres_ShouldReturnEmptyList_WhenNoGenresExist()
    {
        // Act
        var response = await _client.GetAsync("/genres");
        var genres = await response.Content.ReadFromJsonAsync<List<GenreDto>>();

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.NotNull(genres);
        Assert.Empty(genres);
    }

    [Fact]
    public async Task GetGenres_ShouldReturnGenresList_WhenGenresExist()
    {
        // Arrange
        await SeedTestGenres();

        // Act
        var response = await _client.GetAsync("/genres");
        var genres = await response.Content.ReadFromJsonAsync<List<GenreDto>>();

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.NotNull(genres);
        Assert.Equal(3, genres.Count);
        Assert.Contains(genres, g => g.Name == "Action");
        Assert.Contains(genres, g => g.Name == "Adventure");
        Assert.Contains(genres, g => g.Name == "RPG");
    }

    [Fact]
    public async Task GetGenres_ShouldReturnCorrectGenreStructure()
    {
        // Arrange
        await SeedTestGenres();

        // Act
        var response = await _client.GetAsync("/genres");
        var genres = await response.Content.ReadFromJsonAsync<List<GenreDto>>();

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.NotNull(genres);

        var firstGenre = genres.First();
        Assert.True(firstGenre.Id > 0);
        Assert.NotNull(firstGenre.Name);
        Assert.NotEmpty(firstGenre.Name);
    }

    private async Task SeedTestGenres()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<GameStoreContext>();

        // Clear existing data
        context.Genres.RemoveRange(context.Genres);
        await context.SaveChangesAsync();

        // Add test genres
        context.Genres.AddRange(
            new Genre { Name = "Action" },
            new Genre { Name = "Adventure" },
            new Genre { Name = "RPG" }
        );
        await context.SaveChangesAsync();
    }
}