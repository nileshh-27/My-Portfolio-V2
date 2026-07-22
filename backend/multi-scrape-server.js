require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const axios = require('axios');
const cheerio = require('cheerio');

// CONFIGURATION
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyA3vDeXrqS673WQ9YrD0tB4itTgCg0Rr-4",
  authDomain: "my-portfolio-cb334.firebaseapp.com",
  projectId: "my-portfolio-cb334",
  storageBucket: "my-portfolio-cb334.firebasestorage.app",
  messagingSenderId: "948724925353",
  appId: "1:948724925353:web:713728e1eab69e70637ab8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
      submissions: submissions, // Firestore handles nested objects automatically
      rating_history: rating.data.result.map(r => ({
        date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().split('T')[0],
        rating: r.newRating
      })),
      avatar: user.titlePhoto,
      updated_at: new Date()
    };

    await setDoc(doc(db, 'codeforces', handle), payload);
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

    await setDoc(doc(db, 'leetcode', user), payload);
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

    // Rating — first .rating-number div (skip DSA rating which is "NA")
    const ratingText = $("#rating-block-all .rating-number").text().replace(/\D/g, "");
    const rating = parseInt(ratingText || "0");
    const stars = $(".rating-star").text().trim() || "1★";
    const globalRank = $(".rating-ranks ul li:first-child a").text().trim();
    
    // Solved — CodeChef now shows "Total Problems Solved: NNN"
    let solved = 0;
    const pageText = $("body").text();
    const solvedMatch = pageText.match(/Total Problems Solved:\s*(\d+)/i);
    if (solvedMatch) solved = parseInt(solvedMatch[1]);
    // Fallback: also try old format
    if (!solved) {
      const altMatch = pageText.match(/Fully Solved.*?[\(:]?\s*(\d+)/i);
      if (altMatch) solved = parseInt(altMatch[1]);
    }

    // Rating History — from the inline `var all_rating = [...]` in a script tag
    let ratingHistory = [];
    const scriptContent = $("script").map((i, el) => $(el).html()).get().join("\n");
    // Use a greedy match up to the closing ];
    const histMatch = scriptContent.match(/var\s+all_rating\s*=\s*(\[[\s\S]*?\]);/);
    if (histMatch && histMatch[1]) {
        try {
            ratingHistory = JSON.parse(histMatch[1]).map(r => ({
                date: `${r.getyear}-${String(parseInt(r.getmonth)+1).padStart(2,'0')}-${String(parseInt(r.getday)).padStart(2,'0')}`,
                rating: parseInt(r.rating)
            }));
        } catch(e) { console.warn('[CC] Rating history parse error:', e.message); }
    }

    // Also try date_versus_rating from Drupal.settings as a fallback
    if (!ratingHistory.length) {
        const settingsMatch = scriptContent.match(/"date_versus_rating"\s*:\s*\{[^}]*"all"\s*:\s*(\[[\s\S]*?\])\s*,\s*"all_old"/);
        if (settingsMatch && settingsMatch[1]) {
            try {
                ratingHistory = JSON.parse(settingsMatch[1]).map(r => ({
                    date: `${r.getyear}-${String(parseInt(r.getmonth)+1).padStart(2,'0')}-${String(parseInt(r.getday)).padStart(2,'0')}`,
                    rating: parseInt(r.rating)
                }));
            } catch(e) {}
        }
    }

    // Build synthetic submissions from contest participation dates (for heatmap)
    // since userDailyActivityStats is no longer in static HTML
    let submissions = [];
    if (ratingHistory.length) {
      ratingHistory.forEach(r => {
        const ts = new Date(r.date).getTime() / 1000;
        if (Number.isFinite(ts)) {
          submissions.push({ creationTimeSeconds: ts, verdict: 'OK', problem: { name: 'contest' } });
        }
      });
    }

    // Last active from the most recent contest date
    const lastActive = ratingHistory.length
      ? new Date(ratingHistory[ratingHistory.length - 1].date).getTime() / 1000
      : null;

    // --- DB SYNC LOGIC ---
    // Check if we got a 0 for solved but already have a higher number in DB
    const existingSnap = await getDoc(doc(db, 'codechef', user));
    if (solved === 0 && existingSnap.exists()) {
        const existing = existingSnap.data();
        if (existing.solved > 0) {
            console.log(`[CC] Scraper returned 0 solved, keeping existing DB value: ${existing.solved}`);
            solved = existing.solved;
        }
    }

    const payload = {
      username: user,
      rating, stars, global_rank: globalRank,
      solved,
      last_active: lastActive,
      submissions,
      rating_history: ratingHistory,
      avatar: $("div.user-details-container header img").attr("src"),
      updated_at: new Date()
    };

    await setDoc(doc(db, 'codechef', user), payload);
    console.log(`[CC] Success! (Solved: ${solved}, Contests: ${ratingHistory.length}, Rating: ${rating})`);

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
    const existingSnap = await getDoc(doc(db, 'mentorpick', user));
    if (existingSnap.exists()) {
        const existing = existingSnap.data();
        if (solved === 0 && existing.solved > 0) solved = existing.solved;
        if (rating === 0 && existing.rating > 0) rating = existing.rating;
    }

    const payload = {
      username: user,
      rating, solved,
      updated_at: new Date()
    };

    await setDoc(doc(db, 'mentorpick', user), payload);
    console.log(`[MP] Success! (Solved: ${solved}, Rating: ${rating})`);

  } catch (err) {
    console.error(`[MP] Failed: ${err.message}`);
  }
}

// RUN ALL
(async () => {
    await Promise.all([syncCodeforces(), syncLeetCode(), syncCodeChef(), syncMentorPick()]);
    console.log("-----------------------------------");
    console.log("SYNC COMPLETE. Check Firebase Firestore to manually edit any incorrect values.");
    process.exit(0);
})();