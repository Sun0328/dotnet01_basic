````markdown
# dotnet01_basic

A simple .NET project designed to practice build RESTful API for front end.

---

## Overview
![Game Screenshot](/frontend/public/readme/overview.png)

## Edit
![Game Screenshot](/frontend/public/readme/edit.png) 

## Search Feature (By Id or Genres)
![Game Screenshot](/frontend/public/readme/searchBy.png) 
![Game Screenshot](/frontend/public/readme/searchFighting.png) 

## 🖥️ Local Development

Open two terminals and run:

1. **Backend** (API):
   ```bash
   cd GameStore.Api
   dotnet run
   ```

2. **Frontend** (UI):

   ```bash
   cd frontend
   npm run dev
   ```

To run your test suite for the API:

```bash
cd GameStore.Api
dotnet test
```

---

## 🚀 Features

* **RESTful API** built with ASP.NET Core
* **CRUD operations** (Create, Read, Update, Delete)
* **Entity Framework Core** integration with SQLite
* **Clean and minimal** structure for easy understanding
* **Asynchronous** service methods for scalability

---

## 📚 Purpose

This project aims to:

1. Practice building APIs using ASP.NET Core
2. Understand how to connect and interact with a database via EF Core
3. Learn best practices for code organization in real-world projects
4. Serve as a personal reference for ongoing .NET learning

---

## 🛠️ Getting Started

### Prerequisites

* [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
* SQLite (optional, handled via EF Core)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/dotnet01_basic.git
   cd dotnet01_basic
   ```

2. **Restore dependencies**

   ```bash
   dotnet restore
   ```

3. **Build the project**

   ```bash
   dotnet build
   ```

4. **Run the application**

   ```bash
   dotnet run --project GameStore.Api/GameStore.Api.csproj
   ```

By default, the API will be available at `https://localhost:5001`.

---

## 📝 API Endpoints

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/games`      | Retrieve all games      |
| GET    | `/api/games/{id}` | Retrieve a game by ID   |
| POST   | `/api/games`      | Create a new game       |
| PUT    | `/api/games/{id}` | Update an existing game |
| DELETE | `/api/games/{id}` | Delete a game           |

---

## 🔧 Code Structure

* **GameStore.Api/**: ASP.NET Core project hosting the API
* **GameStore.Api/Controllers**: API controllers and routing
* **GameStore.Api/Models**: Entity classes and EF Core `DbContext`
* **GameStore.Api/Dtos**: Data Transfer Objects for requests and responses
* **GameStore.Api/Services**: Business logic and data access layer

---

## 💡 Key Concepts Covered

1. **Dependency Injection**: Registering services in `Program.cs`
2. **Entity Framework Core**: Migrations, InMemory and SQLite providers
3. **Asynchronous Programming**: `async`/`await` in controller actions
4. **Reflection**: Common pitfalls & solutions
5. **Error Handling**: Model validation and global exception filters

---

## 📈 Next Steps

* Add **authentication** and **authorization**
* Implement **integration tests** for API endpoints
* Explore **Docker** for containerization
* Extend with a **frontend** (e.g., React or Blazor)

---

## 🎓 Learning Resources

* [Microsoft ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
* [EF Core Getting Started](https://docs.microsoft.com/ef/core)
* [C# Guide](https://docs.microsoft.com/dotnet/csharp)

```
```
