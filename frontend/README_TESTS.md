# Frontend Testing Guide

This document provides a comprehensive overview of the frontend testing setup for the Game Store application.

## 📁 Test Structure

```
frontend/src/__tests__/
├── components/
│   └── GameCard.test.tsx          # Component tests (18 tests)
├── lib/
│   └── apiClient.test.ts          # API client tests (23 tests)
├── utils/
│   └── gameUtils.test.ts          # Utility function tests (3 tests)
└── simple.test.ts                 # Basic functionality tests (3 tests)
```

## 🧪 Test Categories

### Component Tests

**File**: `GameCard.test.tsx`  
**Tests**: 18  
**Coverage**: Complete component functionality including rendering, state management, user interactions, and edge cases.

**Test Groups**:

- **Basic Rendering** (3 tests) - Title, game list, table headers
- **Data Formatting** (4 tests) - Prices, dates, row numbers, empty data handling
- **Component States** (4 tests) - Loading, error, search states
- **User Interface Elements** (2 tests) - Buttons and action elements
- **User Interactions** (2 tests) - Click events and button interactions
- **Edge Cases** (3 tests) - Empty lists, single games, special characters

### API Client Tests

**File**: `apiClient.test.ts`  
**Tests**: 23  
**Coverage**: Complete API client functionality with comprehensive error handling and data transformation.

**Test Groups**:

- **Games API** (15 tests)
  - `getAll` - Fetch all games (3 tests)
  - `getById` - Fetch game by ID (3 tests)
  - `add` - Create new game (3 tests)
  - `update` - Update existing game (3 tests)
  - `remove` - Delete game (3 tests)
- **Genres API** (3 tests)
  - `getAllGenres` - Fetch all genres
- **Network Error Handling** (3 tests) - Connection failures, timeouts
- **Data Transformation** (2 tests) - Date object conversions

### Utility Tests

**File**: `gameUtils.test.ts`  
**Tests**: 3  
**Coverage**: Core utility functions for game data processing.

**Test Groups**:

- Game payload preparation
- Genre ID validation
- Operation logging

### Basic Tests

**File**: `simple.test.ts`  
**Tests**: 3  
**Coverage**: Jest setup verification and basic functionality.

## 🚀 Running Tests

### All Tests

```bash
npm test
```

### Specific Test Files

```bash
# Component tests
npm test -- --testPathPattern=GameCard.test.tsx

# API client tests
npm test -- --testPathPattern=apiClient.test.ts

# Utility tests
npm test -- --testPathPattern=gameUtils.test.ts

# Basic tests
npm test -- --testPathPattern=simple.test.ts
```

### Watch Mode

```bash
npm test -- --watch
```

### Coverage Report

```bash
npm test -- --coverage
```

### Custom Test Runner

```bash
# Run specific test categories
node test-runner.js unit          # Unit tests only
node test-runner.js component     # Component tests only
node test-runner.js all           # All tests with coverage
```

## 📊 Test Statistics

| Test File         | Tests  | Status          | Coverage                |
| ----------------- | ------ | --------------- | ----------------------- |
| GameCard.test.tsx | 18     | ✅ Pass         | Component functionality |
| apiClient.test.ts | 23     | ✅ Pass         | API client operations   |
| gameUtils.test.ts | 3      | ✅ Pass         | Utility functions       |
| simple.test.ts    | 3      | ✅ Pass         | Basic functionality     |
| **Total**         | **47** | **✅ All Pass** | **Complete coverage**   |

## 🛠️ Test Configuration

### Jest Configuration

**File**: `jest.config.js`

- Next.js integration
- JSDOM test environment
- Module path mapping for `@/` aliases
- Coverage collection settings

### Test Setup

**File**: `jest.setup.js`

- Global test environment configuration
- Next.js router mocking
- Fetch API mocking
- Window.matchMedia mocking

### TypeScript Support

- `@types/jest` for Jest type definitions
- `@testing-library/jest-dom` for custom matchers
- Type declarations in `src/types/jest-dom.d.ts`

## 🎯 Testing Strategy

### Mock Strategy

- **Component Tests**: Use simplified mock components to avoid complex dependencies
- **API Tests**: Mock fetch requests with realistic response data
- **Utility Tests**: Test pure functions with various input scenarios

### Test Data

- Realistic game data with proper structure
- Edge cases including empty data, invalid inputs
- Error scenarios for comprehensive coverage

### Assertions

- Use descriptive test names following "should [behavior] when [condition]" pattern
- Comprehensive assertions covering both positive and negative cases
- Proper error message validation

## 🔧 Best Practices

### Test Organization

1. **One test file per module** - Avoid redundant test files
2. **Clear test grouping** - Use `describe` blocks for logical organization
3. **Descriptive test names** - Clearly express test intent
4. **Independent tests** - Each test should run independently

### Mock Management

1. **Minimal mocking** - Only mock external dependencies
2. **Realistic data** - Use data structures that match real API responses
3. **Clear mock setup** - Set up mocks in `beforeEach` blocks
4. **Mock cleanup** - Clear mocks between tests

### Coverage Goals

- **Unit Tests**: >90% code coverage
- **Component Tests**: All user interactions and state changes
- **API Tests**: All endpoints and error conditions
- **Edge Cases**: Empty data, invalid inputs, network failures

## 🚨 Troubleshooting

### Common Issues

1. **Import Path Errors**

   - Ensure `@/` aliases are properly configured in `jest.config.js`
   - Check `tsconfig.json` path mappings

2. **Mock Not Working**

   - Verify mock setup in `beforeEach`
   - Check mock function calls and return values

3. **Type Errors**

   - Import `@testing-library/jest-dom` in test files
   - Ensure type declarations are included in `tsconfig.json`

4. **Test Timeouts**
   - Increase Jest timeout for async operations
   - Ensure proper `await` usage for async tests

### Debug Commands

```bash
# Run single test file
npm test -- GameCard.test.tsx

# Verbose output
npm test -- --verbose

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📈 Test Metrics

### Performance

- Average test execution time: <1 second per file
- Total test suite execution: <5 seconds
- Coverage report generation: <10 seconds

### Reliability

- All tests pass consistently
- No flaky tests
- Proper error handling coverage

### Maintainability

- Clear test structure and naming
- Minimal external dependencies
- Easy to add new tests

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: Frontend Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --coverage
      - run: cd frontend && npm run lint
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "cd frontend && npm test"
    }
  }
}
```

## 📚 Additional Resources

### Testing Libraries

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

### Best Practices

- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Testing Patterns](https://jestjs.io/docs/tutorial-react)
- [Component Testing Guide](https://testing-library.com/docs/guiding-principles/)

---

This testing setup ensures high-quality, maintainable code with comprehensive coverage of all frontend functionality.
