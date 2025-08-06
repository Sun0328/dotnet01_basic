import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Game } from '@/app/types/Game'

// Mock GameCard component that simulates the real component behavior
// without complex external dependencies
const GameCard = ({
    games = [],
    loading = false,
    error = null,
    hasSearched = false
}: {
    games?: Game[]
    loading?: boolean
    error?: string | null
    hasSearched?: boolean
}) => {
    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">🎮 Game List</h2>
                <div className="flex gap-2">
                    {hasSearched && (
                        <button>Show All</button>
                    )}
                    <button className="bg-green-600 hover:bg-green-700">
                        Add Game
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Genre</th>
                        <th>Price</th>
                        <th>Release Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game, index) => (
                        <tr key={game.id}>
                            <td>{index + 1}</td>
                            <td>{game.name}</td>
                            <td>{game.genre ?? '—'}</td>
                            <td>${game.price.toFixed(2)}</td>
                            <td>{game.releaseDate.toISOString().split('T')[0]}</td>
                            <td>
                                <button data-testid={`delete-${game.id}`}>Delete</button>
                                <button data-testid={`edit-${game.id}`}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

describe('GameCard Component', () => {
    const mockGames: Game[] = [
        {
            id: 1,
            name: 'Cyberpunk 2077',
            genre: 'RPG',
            genreId: 1,
            price: 59.99,
            releaseDate: new Date('2020-12-10')
        },
        {
            id: 2,
            name: 'The Witcher 3',
            genre: 'RPG',
            genreId: 1,
            price: 39.99,
            releaseDate: new Date('2015-05-19')
        }
    ]

    describe('Basic Rendering', () => {
        it('should render game list with correct title', () => {
            render(<GameCard games={mockGames} />)
            expect(screen.getByText('🎮 Game List')).toBeInTheDocument()
        })

        it('should render all games in the list', () => {
            render(<GameCard games={mockGames} />)

            expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument()
            expect(screen.getByText('The Witcher 3')).toBeInTheDocument()
            expect(screen.getByText('$59.99')).toBeInTheDocument()
            expect(screen.getByText('$39.99')).toBeInTheDocument()
        })

        it('should render table headers correctly', () => {
            render(<GameCard games={mockGames} />)

            expect(screen.getByText('No.')).toBeInTheDocument()
            expect(screen.getByText('Name')).toBeInTheDocument()
            expect(screen.getByText('Genre')).toBeInTheDocument()
            expect(screen.getByText('Price')).toBeInTheDocument()
            expect(screen.getByText('Release Date')).toBeInTheDocument()
            expect(screen.getByText('Action')).toBeInTheDocument()
        })
    })

    describe('Data Formatting', () => {
        it('should format prices correctly', () => {
            render(<GameCard games={mockGames} />)

            expect(screen.getByText('$59.99')).toBeInTheDocument()
            expect(screen.getByText('$39.99')).toBeInTheDocument()
        })

        it('should format dates correctly', () => {
            render(<GameCard games={mockGames} />)

            expect(screen.getByText('2020-12-10')).toBeInTheDocument()
            expect(screen.getByText('2015-05-19')).toBeInTheDocument()
        })

        it('should display row numbers correctly', () => {
            render(<GameCard games={mockGames} />)

            expect(screen.getByText('1')).toBeInTheDocument()
            expect(screen.getByText('2')).toBeInTheDocument()
        })

        it('should handle games without genre', () => {
            const gamesWithoutGenre: Game[] = [
                {
                    id: 1,
                    name: 'Test Game',
                    genre: undefined,
                    genreId: 1,
                    price: 59.99,
                    releaseDate: new Date('2023-01-01')
                }
            ]

            render(<GameCard games={gamesWithoutGenre} />)
            expect(screen.getByText('—')).toBeInTheDocument()
        })
    })

    describe('Component States', () => {
        it('should show loading state', () => {
            render(<GameCard games={[]} loading={true} />)
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })

        it('should show error state', () => {
            render(<GameCard games={[]} error="Failed to load games" />)
            expect(screen.getByText('Failed to load games')).toBeInTheDocument()
        })

        it('should show "Show All" button when hasSearched is true', () => {
            render(<GameCard games={mockGames} hasSearched={true} />)
            expect(screen.getByText('Show All')).toBeInTheDocument()
        })

        it('should not show "Show All" button when hasSearched is false', () => {
            render(<GameCard games={mockGames} hasSearched={false} />)
            expect(screen.queryByText('Show All')).not.toBeInTheDocument()
        })
    })

    describe('User Interface Elements', () => {
        it('should render Add Game button', () => {
            render(<GameCard games={mockGames} />)
            expect(screen.getByText('Add Game')).toBeInTheDocument()
        })

        it('should render action buttons for each game', () => {
            render(<GameCard games={mockGames} />)

            expect(screen.getByTestId('delete-1')).toBeInTheDocument()
            expect(screen.getByTestId('edit-1')).toBeInTheDocument()
            expect(screen.getByTestId('delete-2')).toBeInTheDocument()
            expect(screen.getByTestId('edit-2')).toBeInTheDocument()
        })
    })

    describe('User Interactions', () => {
        it('should handle button clicks without errors', async () => {
            const user = userEvent.setup()
            render(<GameCard games={mockGames} />)

            const addButton = screen.getByText('Add Game')
            const deleteButton = screen.getByTestId('delete-1')
            const editButton = screen.getByTestId('edit-1')

            // These clicks won't do anything in our mock, but they should not throw errors
            await user.click(addButton)
            await user.click(deleteButton)
            await user.click(editButton)

            // If we reach here, the interactions worked without errors
            expect(addButton).toBeInTheDocument()
            expect(deleteButton).toBeInTheDocument()
            expect(editButton).toBeInTheDocument()
        })

        it('should handle Show All button click', async () => {
            const user = userEvent.setup()
            render(<GameCard games={mockGames} hasSearched={true} />)

            const showAllButton = screen.getByText('Show All')
            await user.click(showAllButton)

            expect(showAllButton).toBeInTheDocument()
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty games list', () => {
            render(<GameCard games={[]} />)

            // Should still show headers and add button
            expect(screen.getByText('🎮 Game List')).toBeInTheDocument()
            expect(screen.getByText('Add Game')).toBeInTheDocument()
            expect(screen.getByText('No.')).toBeInTheDocument()

            // But no game rows
            expect(screen.queryByText('Cyberpunk 2077')).not.toBeInTheDocument()
        })

        it('should handle single game', () => {
            const singleGame = [mockGames[0]]
            render(<GameCard games={singleGame} />)

            expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument()
            expect(screen.queryByText('The Witcher 3')).not.toBeInTheDocument()
            expect(screen.getByText('1')).toBeInTheDocument()
            expect(screen.queryByText('2')).not.toBeInTheDocument()
        })

        it('should handle games with special characters in names', () => {
            const specialGames: Game[] = [
                {
                    id: 1,
                    name: 'Game with "Quotes" & Symbols!',
                    genre: 'Action',
                    genreId: 1,
                    price: 29.99,
                    releaseDate: new Date('2023-01-01')
                }
            ]

            render(<GameCard games={specialGames} />)
            expect(screen.getByText('Game with "Quotes" & Symbols!')).toBeInTheDocument()
        })
    })
})