using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Api.Dtos;
using GameStore.Api.Entities;

namespace GameStore.Api.Mapping
{
    public static class GenreMapping
    {
        public static GenreDto ToDto(this Genre genre)
        {
            return new GenreDto(genre.Id, genre.Name);
        }
    }
}