// src/screens/Status/status.tsx
import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, fromUnixTime, subDays } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type PlatformData = any;

/**
 * -----------------------
 * Supabase REST helper
 * -----------------------
 * Replace values below if your supabase URL / anon key differ.
 */
const SUPABASE_URL = "https://nyeidqiinmfhsjduitjq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZWlkcWlpbm1maHNqZHVpdGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDEwNDUsImV4cCI6MjA3OTM3NzA0NX0.Ggb6bPko3iRhGYIBjB25FOVyAPlTxmV4xzufWTRsXIM";

/** Fetch one row from a supabase table (rest v1) — returns object or null */
async function fetchTable(table: string) {
  if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_SUPABASE_URL"))
    return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length ? data[0] : null;
  } catch (e) {
    console.error("fetchTable error:", e);
    return null;
  }
}

/**
 * Build heatmap values expected by react-calendar-heatmap using submission list.
 * Expects submissions with `creationTimeSeconds` numbers (UNIX seconds).
 */
function buildHeatmap(submissions: any[] = []) {
  const endDate = new Date();
  const startDate = subDays(endDate, 364);
  const counts: Record<string, number> = {};
  for (const s of submissions) {
    if (!s?.creationTimeSeconds) continue;
    // some sources may already have number; defensively convert
    const ts = Number(s.creationTimeSeconds);
    if (!Number.isFinite(ts)) continue;
    const d = format(fromUnixTime(ts), "yyyy-MM-dd");
    counts[d] = (counts[d] || 0) + 1;
  }
  const arr: { date: string; count: number }[] = [];
  for (let i = 0; i < 365; i++) {
    const dt = subDays(endDate, 364 - i);
    const ds = format(dt, "yyyy-MM-dd");
    arr.push({ date: ds, count: counts[ds] || 0 });
  }
  return {
    startDate,
    endDate,
    values: arr,
    max: Math.max(...arr.map((v) => v.count), 0),
  };
}

/**
 * Normalize ratingHistory for charts.
 * Accepts multiple shapes:
 *  - [{date: "2025-08-01", rating: 1200}, ...]
 *  - Codeforces style: [{ratingUpdateTimeSeconds: <sec>, newRating: 1200}, ...]
 *  - LeetCode style: {contest: {startTime: <sec>}, rating: 1200, attended: true}
 */
function normalizeRatingHistory(raw: any[] = []) {
  if (!Array.isArray(raw)) return [];
  const out = raw
    .map((r) => {
      if (!r) return null;
      // Already normalized
      if (r.date && (r.rating !== undefined)) {
        return { date: String(r.date).slice(0, 10), rating: Number(r.rating) };
      }
      // Codeforces (ratingUpdateTimeSeconds, newRating)
      if (r.ratingUpdateTimeSeconds && r.newRating !== undefined) {
        const date = format(fromUnixTime(Number(r.ratingUpdateTimeSeconds)), "yyyy-MM-dd");
        return { date, rating: Number(r.newRating) };
      }
      // LeetCode (contest.startTime seconds, rating)
      if (r.contest && (r.contest.startTime !== undefined) && (r.rating !== undefined)) {
        let ts = Number(r.contest.startTime);
        if (ts < 1e12) ts = ts * 1000; // convert seconds -> ms if needed
        return { date: new Date(ts).toISOString().slice(0, 10), rating: Number(r.rating) };
      }
      // Generic fields
      if (r.timestamp && r.rating) {
        // timestamp may be seconds
        let ts = Number(r.timestamp);
        if (ts < 1e12) ts = ts * 1000;
        return { date: new Date(ts).toISOString().slice(0, 10), rating: Number(r.rating) };
      }
      return null;
    })
    .filter(Boolean) as { date: string; rating: number }[];

  // sort ascending by date
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

/** Small helper to safely get submissions array */
function safeSubs(data: any) {
  if (!data) return [];
  if (Array.isArray(data.submissions)) return data.submissions;
  if (Array.isArray(data.subs)) return data.subs;
  return [];
}

export const Status = (): JSX.Element => {
  const [cf, setCf] = useState<PlatformData | null>(null);
  const [lc, setLc] = useState<PlatformData | null>(null);
  const [cc, setCc] = useState<PlatformData | null>(null);
  const [mp, setMp] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFromSupabase() {
      setLoading(true);
      try {
        const [cfRow, lcRow, ccRow, mpRow] = await Promise.all([
          fetchTable("codeforces"),
          fetchTable("leetcode"),
          fetchTable("codechef"),
          fetchTable("mentorpick"),
        ]);
        setCf(cfRow);
        setLc(lcRow);
        setCc(ccRow);
        setMp(mpRow);
      } catch (err) {
        console.error("Failed to load supabase tables:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFromSupabase();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 text-center text-white">
        <div className="inline-block w-10 h-10 border-4 border-transparent border-t-violet-400 rounded-full animate-spin" />
        <div className="mt-3 text-gray-300">Loading stats…</div>
      </div>
    );
  }

  /** Render a platform card: modern glass look (V2) but uses V1 heatmap */
  const renderPlatformBox = (title: string, data: any, accent: string) => {
    const submissions: any[] = safeSubs(data);
    const rating = data?.user?.rating ?? data?.rating ?? "N/A";
    // solved: if platform exposed solved directly use it, else try count unique ACs for CF
    let solved = data?.solved ?? data?.ac_count ?? 0;
    if (!solved && data?.platform === "codeforces" && Array.isArray(data.submissions)) {
      const ok = (data.submissions || []).filter((s: any) => s.verdict === "OK" || s.verdict === "Accepted");
      const set = new Set(ok.map((s: any) => `${s.problem?.contestId||""}-${s.problem?.index||""}-${s.problem?.name||""}`));
      solved = set.size;
    }
    const lastActiveTs = data?.lastActive ?? (submissions[0]?.creationTimeSeconds ?? null);
    const lastActive = lastActiveTs ? format(fromUnixTime(Number(lastActiveTs)), "dd MMM yyyy, HH:mm") : "N/A";
    const heat = buildHeatmap(submissions);

    const ratingHistory = normalizeRatingHistory(data?.ratingHistory || data?.rating_history || []);

    return (
      <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-md">
        <h3 className="text-lg font-bold mb-3" style={{ color: accent }}>{title}</h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2 rounded bg-black/20 border border-white/10">
            <p className="text-gray text-sm">Rating</p>
            <p className="text-white font-bold">{rating}</p>
          </div>
          <div className="p-2 rounded bg-black/20 border border-white/10">
            <p className="text-gray text-sm">Problems Solved</p>
            <p className="text-white font-bold">{solved ?? 0}</p>
          </div>

          <div className="p-2 rounded bg-black/20 border border-white/10">
            <p className="text-gray text-sm">Last Active</p>
            <p className="text-white">{lastActive}</p>
          </div>
          <div className="p-2 rounded bg-black/20 border border-white/10">
            <p className="text-gray text-sm">Data Points</p>
            <p className="text-white">{submissions.length}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray mb-2">Activity Heatmap</p>
          <div className="p-3 border border-white/10 rounded bg-black/20">
            <CalendarHeatmap
              startDate={heat.startDate}
              endDate={heat.endDate}
              values={heat.values}
              showWeekdayLabels
              classForValue={(v) => {
                if (!v || v.count === 0) return "color-empty";
                if (v.count >= 5) return "color-scale-4";
                if (v.count >= 3) return "color-scale-3";
                return "color-scale-2";
              }}
              tooltipDataAttrs={(v) => (v ? { "data-tip": `${v.date}: ${v.count} submissions` } : {})}
            />
            <div className="flex items-center gap-2 mt-2 text-xs text-gray">
              <span>Less</span>
              <div className="w-4 h-4 bg-slate-700 rounded-sm" />
              <div className="w-4 h-4 bg-[#6b7280] rounded-sm" />
              <div className="w-4 h-4 bg-[#8b5cf6] rounded-sm" />
              <div className="w-4 h-4 bg-[#7c3aed] rounded-sm" />
              <span>More</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray mb-2">Rating History</p>
          <div className="p-3 border border-white/10 rounded bg-black/20" style={{ height: 200 }}>
            {ratingHistory.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke={accent} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray text-sm">No rating history available</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-white font-['Fira_Code'] mb-2">Competitive Programming Dashboard</h1>
      <p className="text-gray mb-6">Live stats from Codeforces, LeetCode, CodeChef & MentorPick</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>{renderPlatformBox("Codeforces", cf, "#c084fc")}</div>
        <div>{renderPlatformBox("LeetCode", lc, "#facc15")}</div>

        <div>{renderPlatformBox("CodeChef", cc, "#fb923c")}</div>
        <div>{renderPlatformBox("MentorPick", mp, "#34d399")}</div>
      </div>

      {/* local CSS that matches your original heatmap color scale & grid stroke */}
      <style jsx>{`
        .color-empty { background: transparent; border-radius: 4px; }
        .color-scale-2 { background: rgba(124, 58, 237, 0.35); border-radius: 4px; }
        .color-scale-3 { background: rgba(124, 58, 237, 0.6); border-radius: 4px; }
        .color-scale-4 { background: rgba(124, 58, 237, 0.9); border-radius: 4px; }
        /* weaken week separators so it matches old UI */
        .react-calendar-heatmap .react-calendar-heatmap-week > rect {
          stroke: rgba(255,255,255,0.03);
        }
      `}</style>
    </div>
  );
};

export default Status;
