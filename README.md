# JG Arcade

JG Arcade is a social competitive platform designed to track match results, manage peer-to-peer challenges, and maintain leaderboards for various arcade and office games

## Running Locally

### Prerequisites

- [Turso CLI](https://turso.tech/docs/cli/install)
- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)

### Running the Application

First, copy the `.env.example` file to `.env` and fill in the values:
```bash
cp .env.example .env
```

Then, install the dependencies:
```bash
pnpm install
```

On your first run, you'll want to execute the database migrations to populate the database with the initial schema:
```bash
pnpm run db:migrate
```

Then, run the database and leave it running in the background:
```bash
pnpm run db:local
```

Then, in another terminal, run the application:
```bash
pnpm run dev
```
