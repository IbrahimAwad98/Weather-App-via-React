// Proxy mot OpenWeatherMap. Finns för att API-nyckeln ska stanna på servern —
// en NEXT_PUBLIC_-variabel bakas in i klientbundeln och syns för varje besökare.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q");

  if (!q) {
    return Response.json({ cod: 400, message: "Missing city" }, { status: 400 });
  }

  const key = process.env.WEATHER_API_KEY;

  // Utan nyckel svarar OpenWeatherMap 401, vilket klienten hade visat som
  // "City not found". Säg vad som faktiskt är fel i stället.
  if (!key) {
    return Response.json(
      { cod: 500, message: "WEATHER_API_KEY is not set on the server" },
      { status: 500 }
    );
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", q);
  url.searchParams.set("appid", key);
  url.searchParams.set("units", "metric");

  const res = await fetch(url);

  // Svaret skickas vidare oförändrat — klienten läser data.cod själv.
  return Response.json(await res.json(), { status: res.status });
}
