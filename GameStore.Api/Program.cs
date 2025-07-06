using GameStore.Api.Data;
using GameStore.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("GameStore");

// Add CORS policy to allow requests from the frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register the DbContext with SQLite provider (service provider)(scoped lifetime)
builder.Services.AddSqlite<GameStoreContext>(connString);

var app = builder.Build();

// CORS middleware
app.UseCors("AllowFrontend");

app.MapGamesEndpoints();
app.MapGenreEndpoints();

await app.MigrateDbAsync();

app.Run();
