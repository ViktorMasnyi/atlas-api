<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Loan Eligibility API built with Langchain AI Agent, NestJS, TypeORM, PostgreSQL, json-rules-engine, API key auth, Pino logging, Docker Compose, and Vitest.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run typeorm:run
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start
```

## Test

# unit tests
```bash
$ pnpm run test:unit
```
# CI run with coverage
```bash
$ pnpm run test:unit:ci
```
## Environment

Set the following variables (example values):

```bash
OPENAI_API_KEY=your-openai-api-key
ZYLA_API_KEY=your-zylalabs-api-key
API_KEY=dev-api-key
ADMIN_API_KEY=dev-admin-key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atlas
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
```
Note!
ZYLA_API_KEY can be any non empty string

## API Endpoints
see the postman collection in `docs/atlas.postman_collection.json`

the Postman collection contains the put request with extended validation rules for the loan application.
App can perform basic evaluation with the default rules, but the extended rules can be used to add AI agent crime analysis score to the evaluation.
the crime acore API mock service is providing the hardcoded response for the crime analysis (one response is for high risc other is for low risc), so you can test the extended rules bu running the request 
```aiignore
POST /loan
```
multiple times with the same payload, and you will see the different results based on the crime score.


## Swagger

Available at `/docs` when the app is running.

## Docker Compose

```bash
docker-compose up --build
```
# Application architecture

```
Loan Application → Crime Analysis Service → LangChain Agent → Zyla Labs API (mocked as stand alone service)
                                      ↓
                              Rule Engine → Loan Decision
```
The crime analysis is performed before rule evaluation, and the crime score is included as a fact in the rule engine evaluation.

## Crime Analysis Module

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



## Stay in touch

- Author - [Viktor Masnyi](https://github.com/ViktorMasnyi)

## License

Nest is [MIT licensed](LICENSE).
