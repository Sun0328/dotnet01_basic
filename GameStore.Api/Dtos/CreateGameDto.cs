using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Dtos;

public record class CreateGameDto(
    [Required][StringLength(50)] string Name, // Add validation attributes
    int GenreId,
    [Range(1,100)] decimal Price,
    DateOnly ReleaseDate
);
