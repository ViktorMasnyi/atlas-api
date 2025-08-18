Home Assignment – Loan Eligibility API
Overview
You are asked to build a small backend service that processes loan applications and determines whether an applicant is eligible for a loan based on defined business rules.
This task evaluates your backend skills, code quality, clarity, and architectural thinking.
Objective
Build a service that allows users to:
-	Submit a loan application
-	Automatically evaluate the applicant’s eligibility
-	Retrieve the loan application with its evaluation result
-	Evaluate eligibility based on customizable business rules (the logic must not be hardcoded – it should be possible to update the eligibility logic without the whole application re-deploy nor restart)
Tech Requirements
-	Language: Node.js with TypeScript (mandatory)
-	Framework: NestJS
-	Database: Postgres,
-	Authentication: Simple API key (static)
-	Docker: Required – the project must run via Docker - add Docker compose with Postgres ruining in the container

Functional Requirements
The services running REST API with 2 endpoints:
1. POST /loan
   Accepts a loan application with the following schema:

```json{
"applicantName": "John Doe",
"creditScore": 720,
"monthlyIncome": 6500,
"requestedAmount": 150000,
"loanTermMonths": 24
}
```
●	Automatically evaluates eligibility based on the rules below.
●	Stores the loan application and eligibility result.

2. GET /loan/:id
   Returns the stored loan application along with the eligibility decision and explanation. Example response:

```json{
"id": "uuid",
"applicantName": "John Doe",
"eligible": true,
"reason": "Passed all checks",
"creditScore": 720,
"monthlyIncome": 6500,
"requestedAmount": 150000,
"loanTermMonths": 24,
"crimeGrade": 1
}

```
3. Eligibility Logic
   An applicant is eligible if both of the following are true:
   ●	creditScore >= 700
   ●	monthlyIncome > (requestedAmount / loanTermMonths) * 1.5
   If the applicant is ineligible, return eligible: false with an appropriate reason, such as "Credit score too low" or "Monthly income too low".
4. Authentication
   The API should require a valid API key sent in the x-api-key header.
   ●	The key can be hardcoded or stored in an environment variable.
   ●	All endpoints must be protected.

5. Docker Support
   Include a working Dockerfile. We should be able to run the service with:

docker build -t loan-api .
docker run -p 3000:3000 loan-api


6. Testing
   ●	Write at least three unit tests for the eligibility logic.
   ●	Use any testing framework (e.g., Jest, Mocha).

Additional Notes
●	Emphasis will be placed on simplicity, clean structure, and maintainability.




