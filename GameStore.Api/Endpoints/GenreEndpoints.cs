using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Api.Data;
using GameStore.Api.Mapping;
using Microsoft.EntityFrameworkCore;


public static class GenreEndpoints
{
    public static RouteGroupBuilder MapGenreEndpoints(this WebApplication app)
    {
       var group = app.MapGroup("genres");

       group.MapGet("/", async (GameStoreContext dbContext) =>
          await dbContext.Genres
                .Select(genre => genre.ToDto())
                .AsNoTracking()
                .ToListAsync()
       );

       return group;
    }
}
