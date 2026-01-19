# Competiscore Web

Competiscore is the best way to keep score of all the different games you play with your friends. Whether it’s Ping Pong, Pool, Pacman, Poker, or any other competition, Competiscore lets you track records, calculate rankings, run tournaments, and build friendly rivalries within your community.

See [docs/product-vision.md](docs/product-vision.md) for more details.

## Codebase Standards

See the [.cursor/rules](.cursor/rules) directory for the codebase standards. While these are meant for agents to read, they are also meant to be used as a guide for the developer to follow.

Right now the repo just uses 1 big rule file, but as the codebase grows, it may be split into multiple files.

## Running Locally

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
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

Now setup husky so it can run the pre-commit hooks:

```bash
pnpm prepare
```

Now run the database container in the background:

```bash
docker compose up -d
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

## Contributing

Generally speaking, all branches should be based on the `main` branch. Feature branches should be named like `feature/my-feature`m bug fixes should be named like `fix/my-bug`, chore changes should be named like `chore/my-chore`, and documentation changes should be named like `docs/my-documentation`. All changes must be made on a feature branch and then submitted as a pull request to the `main` branch in order to be merged.

While not strictly enforced, it is recommended to following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages. This will help with generating release notes and changelogs.

## Usage with AI tools

To start, this codebase has a very simple integration with AI. It assumes you use Claude Code and has Codebase Standards all in [CLAUDE.md](CLAUDE.md). This may evolve as this repo evolves more.

## Migrations

Note that migrations need to be run manually after each schema change. They are not run automatically when the application is started or when a branch is merged into main.
