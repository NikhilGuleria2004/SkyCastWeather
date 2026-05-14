import {useState, useEffect} from  'react';

const API_KEY = "9d4c7d0e54e448cafa6fdb26ee891b96";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
};

const weatherBg = {
  Clear: { from: "#f97316", to: "#fbbf24" },
  Clouds: { from: "#64748b", to: "#94a3b8" },
  Rain: { from: "#1e3a5f", to: "#3b82f6" },
  Drizzle: { from: "#1e40af", to: "#60a5fa" },
  Thunderstorm: { from: "#1e1b4b", to: "#4c1d95" },
  Snow: { from: "#0ea5e9", to: "#e0f2fe" },
  Mist: { from: "#475569", to: "#94a3b8" },
  default: { from: "#0f172a", to: "#1e40af" },
};


function formatTime(unix){
  const d = new Date(unix*1000);
  let m = d.getMinutes();
  let h = d.getHours();

  const ampm = h>=12 ?"PM":"AM";
  h = h % 12 ||12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}



export default function WeatherApp(){
// city  input weather forecast unit loading error
const [city, setCity] = useState("");
const [input, setInput] = useState("");
const [weather, setWeather] = useState(null);
const [forecast, setForecast] = useState([]);
const [unit, setUnit] = useState("metric");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const condition = weather?.weather[0]?.main || 'default';
const bg = weatherBg[condition] || weatherBg.default;
const icon = weatherIcons[condition] || '🌡️';
const tempUnit = unit === "metric" ?"C":"F";


async function getWeather(q){
  if(!q.trim()) return;
  setLoading(true);
  setError("");

  try{
      const[curr,  fore] = await Promise.all([
        fetch(
          `${BASE_URL}/weather?q=${q}&appid=${API_KEY}&units=${unit}`
        ).then((r)=>r.json()),
        fetch(
          `${BASE_URL}/forecast?q=${q}&appid=${API_KEY}&units=${unit}`
        ).then((r)=>r.json())
      ]);

      if(curr.cod !== 200) throw new Error(curr.message);


      setWeather(curr);

      const daily =  {};
      fore.list.forEach((item)=>{
        const d = new Date(item.dt * 1000);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if(!daily[key]) daily[key] = item;
      });

      setForecast(Object.values(daily).slice(0,6));
  }catch(err){
    setError(err.message);
    setWeather(null)
    setForecast([]);
    }

    setLoading(false);
  }

  function handleSearch(e){
      e.preventDefault();
      setCity(input);
      getWeather(input);
  }

  useEffect(()=>{
    if(city) getWeather(city);
  },[unit]);

  const styles = {
    app: {
      minHeight: "100vh",
      padding: "0 16px 60px",
      fontFamily: "'DM Sans', sans-serif",
      color: "#fff",
      background: weather
        ? `linear-gradient(135deg, ${bg.from}, ${bg.to})`
        : "linear-gradient(135deg, #0f172a, #1e3a8a)",
      transition: "0.8s ease",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },

    blob1: {
      position: "absolute",
      top: "-120px",
      right: "-120px",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.06)",
    },

    blob2: {
      position: "absolute",
      bottom: "-100px",
      left: "-100px",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.04)",
    },

    header: {
      width: "100%",
      maxWidth: "680px",
      display: "flex",
      justifyContent: "space-between",
      paddingTop: "28px",
    },

    logo: {
      fontWeight: "800",
      fontSize: "20px",
    },

    unitToggle: {
      display: "flex",
      background: "rgba(255,255,255,0.12)",
      borderRadius: "40px",
      padding: "4px",
    },

    btn: (active) => ({
      border: "none",
      padding: "6px 14px",
      borderRadius: "30px",
      cursor: "pointer",
      background: active ? "#fff" : "transparent",
      color: active ? "#0f172a" : "rgba(255,255,255,0.7)",
      fontWeight: "600",
    }),

    search: {
      marginTop: "30px",
      width: "100%",
      maxWidth: "680px",
      display: "flex",
      gap: "10px",
    },

    input: {
      flex: 1,
      padding: "14px",
      borderRadius: "14px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.1)",
      color: "#fff",
      outline: "none",
    },

    button: {
      padding: "14px 22px",
      borderRadius: "14px",
      border: "none",
      fontWeight: "700",
      cursor: "pointer",
    },

    hero: {
      marginTop: "80px",
      textAlign: "center",
      maxWidth: "500px",
    },

    heroTitle: {
      fontSize: "42px",
      fontWeight: "800",
      lineHeight: 1.1,
    },

    card: {
      marginTop: "24px",
      width: "100%",
      maxWidth: "680px",
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(20px)",
      borderRadius: "28px",
      padding: "32px",
      border: "1px solid rgba(255,255,255,0.2)",
    },

    city: {
      fontSize: "28px",
      fontWeight: "700",
    },

    temp: {
      fontSize: "80px",
      fontWeight: "800",
    },

    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      marginTop: "20px",
      gap: "10px",
    },

    stat: {
      background: "rgba(255,255,255,0.08)",
      padding: "12px",
      borderRadius: "14px",
      textAlign: "center",
    },

    forecast: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "space-between",
    },
  };
  return (
    <div style={styles.app}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.header}>
        <div style={styles.logo}><a href="">SkyCast</a></div>

        <div style={styles.unitToggle}>
          <button
            style={styles.btn(unit === "metric")}
            onClick={() => setUnit("metric")}
          >
            °C
          </button>
          <button
            style={styles.btn(unit === "imperial")}
            onClick={() => setUnit("imperial")}
          >
            °F
          </button>
        </div>
      </div>

      <form style={styles.search} onSubmit={handleSearch}>
        <input
          style={styles.input}
          placeholder="Search city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button style={styles.button}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!weather && !loading && (
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>
            Real-time weather,<br /> beautifully simple.
          </h1>
        </div>
      )}

      {weather && (
        <>
          <div style={styles.card}>
            <div style={styles.city}>
              {weather.name}, {weather.sys.country}
            </div>

            <div style={{ fontSize: "60px" }}>{icon}</div>

            <div style={styles.temp}>
              {Math.round(weather.main.temp)}
              {tempUnit}
            </div>

            <p>{weather.weather[0].description}</p>

            <div style={styles.stats}>
              <div style={styles.stat}>
                Humidity<br />
                {weather.main.humidity}%
              </div>
              <div style={styles.stat}>
                Wind<br />
                {weather.wind.speed}
              </div>
              <div style={styles.stat}>
                Min<br />
                {Math.round(weather.main.temp_min)}
              </div>
              <div style={styles.stat}>
                Max<br />
                {Math.round(weather.main.temp_max)}
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3>5-Day Forecast</h3>

            <div style={styles.forecast}>
              {forecast.map((f, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div>
                    {new Date(f.dt * 1000)
                      .toDateString()
                      .slice(0, 3)}
                  </div>
                  <div style={{ fontSize: "26px" }}>
                    {weatherIcons[f.weather[0].main] || "🌡️"}
                  </div>
                  <div>
                    {Math.round(f.main.temp)}
                    {tempUnit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );


}