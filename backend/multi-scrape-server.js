require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

// CONFIGURATION
const SUPABASE_URL = process.env.SUPABASE_URL || "https://nyeidqiinmfhsjduitjq.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZWlkcWlpbm1maHNqZHVpdGpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzgwMTA0NSwiZXhwIjoyMDc5Mzc3MDQ1fQ.zurzD2upY4cHesxdzy7v9EpuyQHXSCemFapR28QyfXk"; // Use Service Role Key to bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const USERS = {
  CF: "nileshreddyk",
  LC: "nilesh_20", 
  CC: "nileshhh_21",
  MP: "2310030017-karri_nilesh_r"
};

// --- SCAPERS ---

async function syncCodeforces() {
  const handle = USERS.CF;
  console.log(`[CF] Syncing ${handle}...`);
  try {
    const [info, rating, subs] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
      axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
      axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=2000`)
    ]);

    const user = info.data.result[0];
    const rawSubs = subs.data.result;
    
    const submissions = rawSubs.map(s => ({
      creationTimeSeconds: s.creationTimeSeconds,
      verdict: s.verdict,
      problem: { name: s.problem.name }
    }));

    const ac = submissions.filter(s => s.verdict === "OK");
    const solved = new Set(ac.map(s => s.problem.name)).size;

    const payload = {
      handle: handle,
      rating: user.rating,
      rank: user.rank,
      max_rating: user.maxRating,
      solved: solved,
      last_active: submissions.length ? submissions[0].creationTimeSeconds : null,
      submissions: submissions, // Supabase handles JSONB automatically
      rating_history: rating.data.result.map(r => ({
        date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().split('T')[0],
        rating: r.newRating
      })),
      avatar: user.titlePhoto,
      updated_at: new Date()
    };

    const { error } = await supabase.from('codeforces').upsert(payload);
    if (error) throw error;
    console.log(`[CF] Success!`);
  } catch (err) {
    console.error(`[CF] Failed: ${err.message}`);
  }
}

async function syncLeetCode() {
  const user = USERS.LC;
  console.log(`[LC] Syncing ${user}...`);
  try {
    // 1. GraphQL for Stats & History
    const query = `
      query getUserData($username: String!) {
        matchedUser(username: $username) {
          submitStats { acSubmissionNum { difficulty count } }
          profile { userAvatar }
        }
        userContestRanking(username: $username) { rating globalRanking }
        userContestRankingHistory(username: $username) { attended rating contest { startTime } }
      }
    `;
    const gqlRes = await axios.post("https://leetcode.com/graphql", { query, variables: { username: user } }, {
      headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" }
    });
    
    const data = gqlRes.data.data;
    const solved = data.matchedUser?.submitStats?.acSubmissionNum.find(s => s.difficulty === 'All')?.count || 0;
    
    // 2. Recent Subs
    const recentQuery = `query recent($u: String!) { recentSubmissionList(username: $u) { title statusDisplay timestamp } }`;
    const recentRes = await axios.post("https://leetcode.com/graphql", { query: recentQuery, variables: { u: user } }, {
      headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" }
    });

    const submissions = (recentRes.data.data.recentSubmissionList || []).map(s => ({
      creationTimeSeconds: parseInt(s.timestamp),
      verdict: s.statusDisplay === 'Accepted' ? 'OK' : 'WRONG',
      problem: { name: s.title }
    }));

    const ratingHistory = (data.userContestRankingHistory || [])
      .filter(h => h.attended)
      .map(h => ({
        date: new Date(h.contest.startTime * 1000).toISOString().split('T')[0],
        rating: Math.round(h.rating)
      }));

    const payload = {
      username: user,
      rating: Math.round(data.userContestRanking?.rating || 0),
      global_rank: String(data.userContestRanking?.globalRanking || "N/A"),
      solved: solved,
      last_active: submissions.length ? submissions[0].creationTimeSeconds : null,
      submissions: submissions,
      rating_history: ratingHistory,
      avatar: data.matchedUser?.profile?.userAvatar,
      updated_at: new Date()
    };

    const { error } = await supabase.from('leetcode').upsert(payload);
    if (error) throw error;
    console.log(`[LC] Success!`);
  } catch (err) {
    console.error(`[LC] Failed: ${err.message}`);
  }
}

async function syncCodeChef() {
  const user = USERS.CC;
  console.log(`[CC] Syncing ${user}...`);
  try {
    const { data: html } = await axios.get(`https://www.codechef.com/users/${user}`);
    const $ = cheerio.load(html);

    const rating = parseInt($(".rating-number").text().replace(/\D/g, "") || "0");
    const stars = $(".rating-star").text().trim() || "1★";
    const globalRank = $(".rating-ranks ul li:first-child a").text().trim();
    
    // Aggressive Solved Search
    let solved = 0;
    const pageText = $("body").text();
    const solvedMatch = pageText.match(/Fully Solved.*?[\(:]\s*(\d+)[\)]?/);
    if (solvedMatch) solved = parseInt(solvedMatch[1]);

    // Heatmap (Aggressive Regex)
    let submissions = [];
    const scriptContent = $("script").map((i, el) => $(el).html()).get().join("\n");
    const actMatch = scriptContent.match(/(?:var|let|const)?\s*userDailyActivityStats\s*=\s*(\[[\s\S]*?\]);/);
    if (actMatch && actMatch[1]) {
        try {
            JSON.parse(actMatch[1]).forEach(d => {
                for(let k=0; k<d.submission; k++) submissions.push({ creationTimeSeconds: new Date(d.date).getTime()/1000, verdict:'OK' });
            });
        } catch(e) {}
    }

    // Rating History
    let ratingHistory = [];
    const histMatch = scriptContent.match(/all_rating\s*=\s*(\[[\s\S]*?\]);/);
    if (histMatch && histMatch[1]) {
        try {
            ratingHistory = JSON.parse(histMatch[1]).map(r => ({
                date: `${r.getyear}-${String(r.getmonth+1).padStart(2,'0')}-${String(r.getday).padStart(2,'0')}`,
                rating: parseInt(r.rating)
            }));
        } catch(e) {}
    }

    // --- DB SYNC LOGIC ---
    // Check if we got a 0 for solved but already have a higher number in DB
    const { data: existing } = await supabase.from('codechef').select('solved').eq('username', user).single();
    if (solved === 0 && existing && existing.solved > 0) {
        console.log(`[CC] Scraper returned 0 solved, keeping existing DB value: ${existing.solved}`);
        solved = existing.solved;
    }

    const payload = {
      username: user,
      rating, stars, global_rank: globalRank,
      solved,
      last_active: submissions.length ? submissions[submissions.length-1].creationTimeSeconds : null,
      submissions,
      rating_history: ratingHistory,
      avatar: $("div.user-details-container header img").attr("src"),
      updated_at: new Date()
    };

    const { error } = await supabase.from('codechef').upsert(payload);
    if (error) throw error;
    console.log(`[CC] Success! (Solved: ${solved})`);

  } catch (err) {
    console.error(`[CC] Failed: ${err.message}`);
  }
}

async function syncMentorPick() {
  const user = USERS.MP;
  console.log(`[MP] Syncing ${user}...`);
  try {
    const { data: html } = await axios.get(`https://mentorpick.com/user/view/${user}`);
    const $ = cheerio.load(html);
    const text = $("body").text().replace(/\s+/g, " ");

    let solved = 0;
    const solvedM = text.match(/(?:Problems Solved|Solved|Total Solved)\s*[:|-]?\s*(\d+)/i);
    if (solvedM) solved = parseInt(solvedM[1]);

    let rating = 0;
    const scoreM = text.match(/(?:Score|Points|Rating)\s*[:|-]?\s*(\d+)/i);
    if (scoreM) rating = parseInt(scoreM[1]);

    // DB Fallback logic
    const { data: existing } = await supabase.from('mentorpick').select('solved, rating').eq('username', user).single();
    if (solved === 0 && existing?.solved > 0) solved = existing.solved;
    if (rating === 0 && existing?.rating > 0) rating = existing.rating;

    const payload = {
      username: user,
      rating, solved,
      updated_at: new Date()
    };

    const { error } = await supabase.from('mentorpick').upsert(payload);
    if (error) throw error;
    console.log(`[MP] Success! (Solved: ${solved}, Rating: ${rating})`);

  } catch (err) {
    console.error(`[MP] Failed: ${err.message}`);
  }
}

// RUN ALL
(async () => {
    await Promise.all([syncCodeforces(), syncLeetCode(), syncCodeChef(), syncMentorPick()]);
    console.log("-----------------------------------");
    console.log("SYNC COMPLETE. Check Supabase Dashboard to manually edit any incorrect values.");
})();