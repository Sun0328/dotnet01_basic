using GameStore.Api.Data;
using GameStore.Api.Dtos;
using GameStore.Api.Entities;
using GameStore.Api.Mapping;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Endpoints;

public static class GamesEndpoints
{
    const string GetGameEndpointName = "GetGame";

    public static RouteGroupBuilder MapGamesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("games")
                        .WithParameterValidation();

        // GET /games
        group.MapGet("/", async (GameStoreContext dbContext) => 
            await dbContext.Games
                .Include(game => game.Genre)
                // This tells Entity Framework to eager-load the related Genre entity for each Game. Without this, the Genre property would be null unless lazy-loading is enabled. This is important because ToGameSummaryDto() uses game.Genre!.Name.
                .Select(game => game.ToGameSummaryDto())
                .AsNoTracking()
                .ToListAsync()
            );

        // GET /games/1 (one game from group games)
        group.MapGet("/{id}", async (int id, GameStoreContext dbContext) => 
        {
            // Find the game with the specified id in database
            Game? game = await dbContext.Games.FindAsync(id);

            return game is null ? Results.NotFound() : Results.Ok(game.ToGameDetailsDto());
        })
        .WithName(GetGameEndpointName);

        // POST /games
        group.MapPost("/", async (CreateGameDto newGame, GameStoreContext dbContext) =>
        {
            // Not the best way to validate the request

            // if(string.IsNullOrEmpty(newGame.Name))
            // {
            //     return Results.BadRequest("Name is required");
            // }

            // GameDto game = new(
            //     games.Count + 1,
            //     newGame.Name,
            //     newGame.Genre,
            //     newGame.Price,
            //     newGame.ReleaseDate
            // );

            Game game = newGame. ToEntity();

            dbContext.Games.Add(game);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(
                GetGameEndpointName,
                new { id = game.Id }, 
                game.ToGameDetailsDto());
        });

        // PUT /games/1
        group.MapPut("/{id}", async (int id, UpdateGameDto updatedGame, GameStoreContext dbContext) =>
        {
            // Find the game with the specified id
            // var index = games.FindIndex(game => game.Id == id);

            var existingGame = await dbContext.Games.FindAsync(id);

            if (existingGame is null)
            {
                return Results.NotFound();
            }

            // It tells Entity Framework to update the values of the existing entity (existingGame) in the database with new values from the updated DTO (updatedGame), without replacing the whole object manually.
            dbContext.Entry(existingGame)
                .CurrentValues
                .SetValues(updatedGame.ToEntity(id));

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        // DELETE /games/1
        group.MapDelete("/{id}", async (int id, GameStoreContext dbContext) =>
        {
            // Delete the game with the specified id in database (Effective way)
            await dbContext.Games
                .Where(game => game.Id == id)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        });

        return group;
    }
}
