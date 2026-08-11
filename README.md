# Weather App via React

[![CI](https://github.com/IbrahimAwad98/Weather-App-via-React/actions/workflows/ci.yml/badge.svg)](https://github.com/IbrahimAwad98/Weather-App-via-React/actions/workflows/ci.yml)

A small Next.js app that looks up the current weather for a city from
OpenWeatherMap.

CI lints and builds; there are no tests.

## What works

- **Search any city** and see temperature, conditions, wind speed, humidity,
  and what it feels like, with an emoji picked from the reported conditions.
- **A dark toggle** in the top corner. It is a two-value tint — the background
  overlay and the card fill darken — not a full theme. Text stays light in both
  states, so there is no light mode as such.
- **Errors are shown, not swallowed.** A city that does not exist reports the
  message OpenWeatherMap returned; an unreachable network reports that
  separately instead of leaving the spinner running.
- **The API key stays on the server.** The browser calls `/api/weather`, and a
  route handler adds the key and forwards the request.

## Requirements

- Node 20.19+ or 22.12+
- A free [OpenWeatherMap API key](https://openweathermap.org/api)

## Setup

```bash
git clone https://github.com/IbrahimAwad98/Weather-App-via-React.git
cd Weather-App-via-React
npm install
cp .env.example .env.local     # then put your key in it
npm run dev
```

Open <http://localhost:3000>.

**The app needs the key to return any results.** `.env.local` must contain:

```
WEATHER_API_KEY=your_key_here
```

Without it the page still renders, but every search returns
`WEATHER_API_KEY is not set on the server`. New OpenWeatherMap keys take a few
minutes to activate, so a fresh key can return 401 for a short while.

The variable is deliberately **not** prefixed `NEXT_PUBLIC_`. That prefix
inlines the value into the JavaScript bundle sent to the browser, which would
publish the key to every visitor.

## Building

```bash
npm run build
npm start
```

The build does not need the key — it is read per request, not at build time.

## Known gaps

- **`/api/weather` is an open proxy.** The key is hidden from visitors, but
  anyone who finds the endpoint can spend your OpenWeatherMap quota through it.
  Fine on the free tier; it would need rate limiting before anything else.
- **There are no tests.** The CI job is named "Lint, Test & Build" and the test
  step is a no-op, because no test script exists. A green badge means it lints
  and compiles.
- **The layout is fluid, not responsive.** It survives on a phone because the
  card is narrow and centred, not because anything adapts — there is not a
  single media query or breakpoint in the project.

## License

[MIT](LICENSE)
