const API_URL = "https://api.football-data.org/v4/matches";
const DAY_COUNT = 3;
const TIME_ZONE = "Europe/Madrid";

function madridDate(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = {};
  parts.forEach((part) => {
    if (part.type !== "literal") values[part.type] = part.value;
  });
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(date, count) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + count);
  return value.toISOString().slice(0, 10);
}

function formatDay(date, options) {
  const value = new Intl.DateTimeFormat("es-ES", {
    timeZone: TIME_ZONE,
    ...options
  }).format(new Date(`${date}T12:00:00Z`));
  return value.charAt(0).toLocaleUpperCase("es-ES") + value.slice(1);
}

function makeDays(startDate) {
  return Array.from({ length: DAY_COUNT }, (_, index) => {
    const date = addDays(startDate, index);
    return {
      date,
      label: formatDay(date, { weekday: "short", day: "numeric", month: "short" }),
      longLabel: formatDay(date, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      matches: []
    };
  });
}

function mapMatches(matches, days) {
  const daysByDate = new Map(days.map((day) => [day.date, day]));
  const supportedStatuses = new Set(["SCHEDULED", "TIMED", "IN_PLAY", "PAUSED", "LIVE"]);

  matches.forEach((match) => {
    if (!match || !match.utcDate || !supportedStatuses.has(match.status)) return;

    const kickoff = new Date(match.utcDate);
    if (Number.isNaN(kickoff.getTime())) return;

    const date = madridDate(kickoff);
    const day = daysByDate.get(date);
    const home = match.homeTeam && (match.homeTeam.shortName || match.homeTeam.name);
    const away = match.awayTeam && (match.awayTeam.shortName || match.awayTeam.name);
    const competition = match.competition && match.competition.name;
    if (!day || !home || !away || !competition) return;

    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).format(kickoff);

    day.matches.push({
      time,
      comp: competition,
      home,
      away,
      flag: "⚽",
      cat: "futbol",
      venue: match.venue || "",
      tv: [],
      live: match.status === "IN_PLAY" || match.status === "PAUSED" || match.status === "LIVE"
    });
  });

  days.forEach((day) => {
    day.matches.sort((first, second) => first.time.localeCompare(second.time));
  });
}

module.exports = async function fixtures(req, res) {
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=1800");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido." });
  }

  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  if (!token) {
    return res.status(503).json({
      error: "La agenda necesita configurar el token de football-data.org en Vercel."
    });
  }

  const startDate = madridDate(new Date());
  const endDate = addDays(startDate, DAY_COUNT - 1);
  const url = new URL(API_URL);
  url.searchParams.set("dateFrom", addDays(startDate, -1));
  url.searchParams.set("dateTo", addDays(endDate, 1));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": token, Accept: "application/json" },
      signal: controller.signal
    });

    if (!response.ok) {
      console.error("football-data.org returned HTTP", response.status);
      return res.status(502).json({
        error: "No se pudo actualizar la agenda desde football-data.org. Inténtalo más tarde."
      });
    }

    const payload = await response.json();
    if (!payload || !Array.isArray(payload.matches)) {
      console.error("football-data.org returned an unexpected fixtures response");
      return res.status(502).json({
        error: "La respuesta de football-data.org no tenía el formato esperado."
      });
    }

    const days = makeDays(startDate);
    mapMatches(payload.matches, days);
    return res.status(200).json({ days });
  } catch (error) {
    console.error("Could not fetch fixtures from football-data.org:", error.message);
    return res.status(502).json({
      error: "No se pudo conectar con football-data.org. Inténtalo más tarde."
    });
  } finally {
    clearTimeout(timeout);
  }
};
