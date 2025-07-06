using GameStore.Api.Entities;
using GameStore.Api.Dtos;
using GameStore.Api.Mapping;

namespace GameStore.Api.Tests;

public class GenreTests
{
    [Fact]
    // Test that a Game entity can be created 
    // with all properties set correctly.
    public void Genre_ShouldCreateWithValidProperties()
    {
        // Arrange
        var genre = new Genre
        {
            Id = 1,
            Name = "Action"
        };

        // Assert
        Assert.Equal(1, genre.Id);
        Assert.Equal("Action", genre.Name);
    }

    [Fact]
    // Test that a Genre entity can be mapped to a Dto.
    public void Genre_ShouldMapToGenreDto()
    {
        // Arrange
        var genre = new Genre
        {
            Id = 1,
            Name = "Adventure"
        };

        // Act
        var genreDto = genre.ToDto();

        // Assert
        Assert.Equal(1, genreDto.Id);
        Assert.Equal("Adventure", genreDto.Name);
    }
} 