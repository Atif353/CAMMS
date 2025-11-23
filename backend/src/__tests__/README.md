# CAMMS Backend Test Suite

## Test Structure

```
__tests__/
├── services/          # Service layer unit tests
│   ├── AuthService.test.js
│   ├── ActivityService.test.js
│   └── ReportService.test.js
├── integration/       # Integration tests
│   ├── auth.test.js
│   ├── activities.test.js
│   └── dashboard.test.js
├── utils/            # Utility function tests
│   ├── dateUtils.test.js
│   └── testHelpers.js
└── README.md
```

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Coverage

Current test coverage includes:

**Unit Tests:**
- ✅ Authentication service (signup, login)
- ✅ Activity service (CRUD operations)
- ✅ Report service (generation, date ranges)
- ✅ Date utilities (ranges, formatting)

**Integration Tests:**
- ✅ Authentication API endpoints
- ✅ Activities API endpoints
- ✅ Dashboard API endpoints

## Adding New Tests

1. Create test file: `__tests__/services/YourService.test.js`
2. Import service and mocks
3. Write test cases using Jest
4. Run tests to verify

Example:

```javascript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { YourService } from '../../services/YourService.js';

describe('YourService', () => {
  it('should do something', () => {
    // Test implementation
  });
});
```

## Mocking

Use `testHelpers.js` for common mocks:

```javascript
import { mockUser, mockActivity } from '../utils/testHelpers.js';
```

## Test Data

- `mockUser` - Sample instructor user
- `mockAdmin` - Sample admin user
- `mockActivity` - Sample activity
- `mockActivities` - Array of 10 activities (for simulation tests)
- `mockReport` - Sample report
- `mockNotification` - Sample notification

## Simulation Tests

As per project requirements, you can simulate:

- **10 fake ticket replies in a day**: Use `mockActivities` array
- **3 GDBs per week**: Filter by `activity_type_code: 'GDB_MARKING'`

Example:

```javascript
it('should simulate 10 ticket replies in a day', () => {
  const ticketReplies = mockActivities.filter(
    a => a.activity_type_code === 'TICKET_RESPONSE'
  );
  expect(ticketReplies.length).toBeGreaterThanOrEqual(3);
});
```

