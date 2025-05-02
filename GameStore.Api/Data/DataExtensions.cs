// method for migrate the database (Migration) to ensure that the database schema remains consistent with the model defined in DbContext.

using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data
{
    public static class DataExtensions
    {
        public static async Task MigrateDbAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<GameStoreContext>();
            await dbContext.Database.MigrateAsync();
        }
    }
}