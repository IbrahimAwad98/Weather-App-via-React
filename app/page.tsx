"use client";
import { useState } from "react";

// Väder-API ger text som "light rain" — emoji är tydligare för användaren
function getWeatherEmoji(description: string) {
  const d = description.toLowerCase();
  if (d.includes("clear") || d.includes("sunny")) return "☀️";
  if (d.includes("cloud")) return "⛅";
  if (d.includes("rain") || d.includes("drizzle")) return "🌧️";
  if (d.includes("thunder") || d.includes("storm")) return "⛈️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("fog") || d.includes("mist")) return "🌫️";
  if (d.includes("wind")) return "💨";
  return "🌡️";
}

// De fält ur OpenWeatherMap-svaret som appen faktiskt använder
type WeatherData = {
  cod: number;
  name: string;
  sys: { country: string };
  weather: { description: string }[];
  main: { temp: number; humidity: number; feels_like: number };
  wind: { speed: number };
};

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  async function fetchWeather() {
    if (!city) return;

    // Nollställ gammalt resultat så användaren inte ser fel stads data under laddning
    setLoading(true);
    setError("");
    setWeather(null);

    const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
    );
    const data: WeatherData = await res.json();

    // API returnerar cod: 200 vid success, allt annat är ett fel
    if (data.cod !== 200) {
      setError("❌ City not found. Try again!");
    } else {
      setWeather(data);
    }

    setLoading(false);
  }

  // Mörkare overlay i dark mode så kortet syns bättre mot bakgrunden
  const overlay = dark ? "rgba(5,10,30,0.75)" : "rgba(10,30,80,0.45)";

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        overflow: "hidden",
        backgroundImage: "url('/weather-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay dämpar bakgrundsbilden så texten alltid är läsbar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlay,
          zIndex: 1,
        }}
      />

      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 10,
          background: "rgba(255,255,255,0.15)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "50px",
          padding: "8px 16px",
          fontSize: "13px",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
        }}
      >
        {dark ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: dark ? "rgba(10,15,40,0.75)" : "rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "36px",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", letterSpacing: "0.08em", margin: "0 0 20px" }}>
          🌥️ WEATHER APP
        </p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
          <input
            type="text"
            placeholder="🔍 Enter a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "14px",
              padding: "10px 16px",
              fontSize: "14px",
              color: "white",
              outline: "none",
            }}
          />
          <button
            onClick={fetchWeather}
            style={{
              background: "white",
              color: "#1a3a6b",
              border: "none",
              borderRadius: "14px",
              padding: "10px 18px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {loading && (
          <p style={{ color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
            ⏳ Loading...
          </p>
        )}
        {error && (
          <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>
        )}

        {weather && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "white", fontSize: "28px", fontWeight: "600", margin: "0 0 4px" }}>
              📍 {weather.name}, {weather.sys.country}
            </h2>

            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", margin: "0 0 8px", textTransform: "capitalize" }}>
              {getWeatherEmoji(weather.weather[0].description)} {weather.weather[0].description}
            </p>

            <p style={{ color: "white", fontSize: "80px", fontWeight: "700", margin: "8px 0", lineHeight: 1 }}>
              {Math.round(weather.main.temp)}°C
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "16px",
                marginTop: "24px",
                marginBottom: "20px",
              }}
            >
              {[
                { label: "💧 Humidity", value: `${weather.main.humidity}%` },
                { label: "💨 Wind", value: `${Math.round(weather.wind.speed)} m/s` },
                { label: "🌡️ Feels like", value: `${Math.round(weather.main.feels_like)}°C` },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "center" }}>
                  <p style={{ color: "white", fontWeight: "600", fontSize: "16px", margin: 0 }}>
                    {item.value}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", margin: "4px 0 0" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", textAlign: "center", margin: 0 }}>
          © 2025 Ibrahim. All rights reserved.
        </p>
      </div>
    </main>
  );
}