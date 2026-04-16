# FCC Information Security — Stock Price Checker

Express + MongoDB app that returns live stock prices and tallies per-IP "likes", built for the FreeCodeCamp Information Security certification.

## Features

- `GET /api/stock-prices?stock=<SYMBOL>` — fetches the latest price for a stock symbol from the FCC proxy
- `GET /api/stock-prices?stock=<S1>&stock=<S2>` — fetches two stocks and returns relative like counts (`rel_likes`)
- `GET /api/stock-prices?stock=<SYMBOL>&like=true` — records a "like" for the symbol keyed to the requester's IP address (one like per IP)
- Per-IP deduplication is enforced by storing IP addresses in a MongoDB set (`$addToSet`)
- Helmet `contentSecurityPolicy` restricts default, script, and style sources (scripts and styles also permit `'unsafe-inline'` to satisfy the FCC challenge)
- Functional tests cover single stock, like, and two-stock comparison paths

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- Helmet
- Chai / Mocha

## Requirements

- Node.js 16+
- MongoDB 4+
- Yarn 1.x or npm 8+

## Installation

```bash
yarn install
```

## Environment Variables

Create a `.env` file in the project root with:

- `PORT` — server port (defaults to `3000`)
- `NODE_ENV` — `development` | `test` | `production`
- `DB` — MongoDB connection string
- `PATH_API` (**required**) — API route path (canonical value: `/api/stock-prices`)

## Usage

```bash
yarn start
```

Server listens on `http://localhost:3000`.

## Testing

```bash
NODE_ENV=test yarn start
```

## API

- `GET /api/stock-prices` — query params: `stock` (one or two), `like` (optional boolean)

## Project Structure

```
.
├── routes/
├── tests/
├── public/
├── views/
├── db.js
├── server.js
└── package.json
```

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file.
