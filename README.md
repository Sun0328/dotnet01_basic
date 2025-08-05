# Game Store - Full Stack Application

A modern full-stack game management application built with .NET Core API and Next.js frontend, featuring CRUD operations, search functionality, and a clean, modular architecture.

---

## 📸 Screenshots

### Overview

![Game Screenshot](/frontend/public/readme/overview.png)

### Edit Game

![Game Screenshot](/frontend/public/readme/edit.png)

### Search Feature (By Name or Genres)

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

### Backend (ASP.NET Core)

- **RESTful API** with minimal API endpoints
- **CRUD operations** (Create, Read, Update, Delete)
- **Entity Framework Core** integration with SQLite
- **Data validation** with DTOs and model validation
- **Asynchronous** operations for scalability

### Frontend (Next.js + TypeScript)

- **Modern React** with TypeScript and Tailwind CSS
- **State management** with Zustand
- **Modular architecture** with Actions, Stores, and Utils
- **Custom components** with shadcn/ui
- **Search functionality** by name and genre
- **Form validation** with toast notifications
- **Responsive design** with clean UI/UX

---

## Project Structure

```
dotnet_GameStore/
├── 📁 GameStore.Api/                 # Backend API (.NET Core)
│   ├── 📁 Controllers/               # API Controllers (if using)
│   ├── 📁 Data/                      # Database context and configurations
│   ├── 📁 Dtos/                      # Data Transfer Objects
│   │   ├── CreateGameDto.cs
│   │   ├── UpdateGameDto.cs
│   │   ├── GameSummaryDto.cs
│   │   └── GameDetailsDto.cs
│   ├── 📁 Endpoints/                 # Minimal API endpoints
│   │   ├── GamesEndpoints.cs
│   │   └── GenreEndpoints.cs
│   ├── 📁 Entities/                  # Database entities
│   │   ├── Game.cs
│   │   └── Genre.cs
│   ├── 📁 Mapping/                   # Entity-DTO mapping extensions
│   │   └── GameMapping.cs
│   ├── 📁 Properties/                # Project properties
│   ├── Program.cs                    # Application entry point
│   ├── GameStore.db                  # SQLite database
│   └── *.http                        # HTTP test files
│
├── 📁 GameStore.Api.Tests/           # Backend tests
│   └── *.cs                          # Test files
│
├── 📁 frontend/                      # Frontend application (Next.js)
│   ├── 📁 public/                    # Static assets
│   │   └── 📁 readme/                # README screenshots
│   ├── 📁 src/
│   │   ├── 📁 app/                   # Next.js app directory
│   │   │   ├── 📁 types/             # TypeScript type definitions
│   │   │   │   ├── Game.ts
│   │   │   │   ├── UpdateGame.ts
│   │   │   │   └── Genre.ts
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── 📁 components/            # React components
│   │   │   ├── 📁 ui/                # shadcn/ui components
│   │   │   ├── GameCard.tsx          # Main game list component
│   │   │   ├── GameAddModal.tsx      # Add game modal
│   │   │   ├── GameEditModal.tsx     # Edit game modal
│   │   │   ├── GameDeleteModal.tsx   # Delete confirmation modal
│   │   │   ├── DatePicker.tsx        # Custom date picker
│   │   │   └── Search.tsx            # Search functionality
│   │   ├── 📁 lib/                   # Utility libraries
│   │   │   ├── apiClient.ts          # API client functions
│   │   │   └── utils.ts              # General utilities
│   │   ├── 📁 stores/                # State management (Zustand)
│   │   │   ├── 📁 base/              # Base store infrastructure
│   │   │   │   └── createAsyncStore.ts
│   │   │   ├── 📁 actions/           # Business logic actions
│   │   │   │   ├── gameActions.ts
│   │   │   │   └── genreActions.ts
│   │   │   ├── gameStore.ts          # Game state management
│   │   │   ├── genreStore.ts         # Genre state management
│   │   │   └── README.md             # Store architecture docs
│   │   └── 📁 utils/                 # Utility functions
│   │       ├── gameUtils.ts          # Game-specific utilities
│   │       ├── storeUtils.ts         # Store helper functions
│   │       └── index.ts              # Utility exports
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── GameStore.sln                     # Solution file
└── README.md                         # This file
```

---

## 📚 Purpose

This project demonstrates:

1. **Full-stack development** with .NET Core and Next.js
2. **Modern frontend architecture** with modular state management
3. **RESTful API design** with proper data validation
4. **Database integration** with Entity Framework Core
5. **TypeScript best practices** and component architecture
6. **Clean code principles** and separation of concerns

---

## 🛠️ Getting Started

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- SQLite (optional, handled via EF Core)

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

## 🏗️ Architecture Highlights

### Backend Architecture

- **Minimal APIs**: Clean, lightweight endpoint definitions
- **Entity Framework Core**: Code-first database approach
- **DTOs**: Proper data transfer object patterns
- **Mapping Extensions**: Clean entity-DTO transformations

### Frontend Architecture

- **Modular State Management**: Zustand with Actions pattern
- **Component Composition**: Reusable UI components
- **Type Safety**: Full TypeScript integration
- **Custom Hooks**: Encapsulated business logic

---

## 💡 Key Concepts Covered

1. **Dependency Injection**: Registering services in `Program.cs`
2. **Entity Framework Core**: Migrations, InMemory and SQLite providers
3. **Asynchronous Programming**: `async`/`await` in controller actions
4. **Reflection**: Common pitfalls & solutions
5. **Error Handling**: Model validation and global exception filters

---

## 📈 Future Enhancements

- Add **authentication** and **authorization**
- Implement **integration tests** for API endpoints
- Add **Docker** containerization
- Implement **caching** strategies
- Add **pagination** for large datasets
- Implement **real-time updates** with SignalR

---

## 🎓 Learning Resources

### Backend

- [Microsoft ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [EF Core Getting Started](https://docs.microsoft.com/ef/core)
- [C# Guide](https://docs.microsoft.com/dotnet/csharp)

### Frontend

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [Tailwind CSS](https://tailwindcss.com/docs)
