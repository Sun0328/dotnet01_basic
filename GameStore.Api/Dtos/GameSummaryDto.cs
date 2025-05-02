// namespace GameStore.Api.Dtos;
// public class GameDto(
//     int Id,
//     string Name,
//     string Genre,
//     decimal Price,
//     DateOnly ReleaseDate
// );

namespace GameStore.Api.Dtos;

public record GameSummaryDto(
    int Id,
    string Name,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);

