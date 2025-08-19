# Crime Analysis Module

This module integrates crime rate analysis into the loan application process using LangChain AI agents.

## Overview

The crime analysis module:
- Fetches crime data for a given ZIP code from the Zyla Labs API
- Uses a LangChain AI agent to analyze the crime data and determine a crime score (0-1)
- Integrates the crime score into the loan evaluation process
- Stores crime data for future reference

## Features

### Crime Score Calculation
- **0.0**: Lowest crime rate (very safe area)
- **1.0**: Highest crime rate (very dangerous area)
- The AI agent analyzes multiple factors including:
  - Overall crime grade (A-F scale)
  - Violent crime rates
  - Property crime rates
  - Crime frequency and statistics
  - Risk percentages

### Loan Evaluation Integration
- Crime rate threshold: 0.8 (configurable)
- If crime rate >= 0.8: Automatic loan decline
- If crime rate < 0.8: Crime score contributes to aggregate risk assessment
- Crime rate weight: 0.2 (configurable via `CRIME_RATE_WEIGHT` environment variable)

## Configuration

### Environment Variables

```bash
# Required for crime data API
ZYLA_API_KEY=your_zyla_api_key

# Required for LangChain AI agent
OPENAI_API_KEY=your_openai_api_key

# Optional: Crime rate weight in loan evaluation (default: 0.2)
CRIME_RATE_WEIGHT=0.2
```

### API Configuration
- **Zyla Labs API**: `https://zylalabs.com/api/4190/usa++crime+grades+by+zip+code+api/5074/get+data+by+zip`
- **Authentication**: Bearer token
- **Timeout**: 10 seconds
- **Retry**: 1 attempt
- **Rate limit**: 10 requests per second

## Database Schema

### Loan Applications Table
```sql
ALTER TABLE loan_applications 
ADD COLUMN zip_code varchar(10) NOT NULL,
ADD COLUMN crime_score decimal(3,2);
```

### Crime Data Table
```sql
CREATE TABLE crime_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  zip_code varchar(10) UNIQUE NOT NULL,
  crime_score decimal(3,2) NOT NULL,
  raw_data jsonb NOT NULL,
  last_updated timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## API Usage

### Submit Loan Application
```bash
POST /loan
Content-Type: application/json
x-api-key: your_api_key

{
  "applicantName": "John Doe",
  "creditScore": 720,
  "monthlyIncome": 6500,
  "requestedAmount": 150000,
  "loanTermMonths": 24,
  "zipCode": "94109"
}
```

### Response
```json
{
  "id": "b9b1a4f5-0d3a-4bd8-9e6c-6f612c0d7a3e",
  "applicantName": "John Doe",
  "eligible": false,
  "reason": "High crime rate area - loan declined for safety reasons",
  "creditScore": 720,
  "monthlyIncome": 6500,
  "requestedAmount": 150000,
  "loanTermMonths": 24,
  "zipCode": "94109",
  "crimeScore": 0.85,
  "evaluatedAt": "2024-01-15T10:30:00Z",
  "ruleVersion": "v1.2"
}
```

## Business Rules

The system includes updated business rules that consider crime rates:

1. **Approval**: Credit score >= 700, income ratio > 1.5, AND crime rate < 0.8
2. **Automatic Decline**: Credit score >= 700, income ratio > 1.5, BUT crime rate >= 0.8
3. **Standard Decline**: Credit score < 700 OR income ratio <= 1.5

## Testing

### Unit Tests
```bash
pnpm test:unit
```

### Integration Tests
```bash
pnpm test
```

### Test Coverage
- Crime analysis service methods
- API integration with mocked responses
- Error handling scenarios
- Database operations

## Error Handling

- **API Timeout**: Returns 500 with "Unable to get crime rate"
- **Missing API Keys**: Throws configuration error
- **Invalid ZIP Code**: Validated by DTO
- **Network Errors**: Logged and propagated

## Monitoring

The module includes comprehensive logging:
- Crime analysis requests and results
- API call success/failure
- Database operations
- Error scenarios

## Migration

Run the database migration to add crime analysis support:

```bash
pnpm typeorm:run
```

This will:
1. Add `zip_code` and `crime_score` columns to `loan_applications`
2. Create the `crime_data` table
3. Add appropriate indexes

## Sample Business Rules

Use the admin endpoint to update business rules:

```bash
PUT /admin/rules
Content-Type: application/json
x-api-key: your_admin_api_key

# Use the content from src/admin/sample-rules-with-crime.json
```

## Architecture

```
Loan Application → Crime Analysis Service → LangChain Agent → Zyla Labs API
                                      ↓
                              Rule Engine → Loan Decision
```

The crime analysis is performed before rule evaluation, and the crime score is included as a fact in the rule engine evaluation.
