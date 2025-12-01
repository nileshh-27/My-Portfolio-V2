const express = require("express");
const axios = require("axios");

const router = express.Router();

const LEETCODE_API = "https://leetcode.com/graphql";

router.get("/", async (req, res) => {
  const username = req.query.user;
  if (!username) return res.status(400).json({ error: "user required" });

  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          submissionCalendar
          streak
          totalActiveDays
        }
        profile {
          ranking
          reputation
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      LEETCODE_API,
      { query, variables: { username } },
      { headers: { "Content-Type": "application/json" } }
    );

    const u = response.data.data.matchedUser;

    if (!u) return res.status(404).json({ error: "User not found" });

    const calendar = u.userCalendar?.submissionCalendar || "{}";
    const parsedCalendar = JSON.parse(calendar);

    const submissions = Object.entries(parsedCalendar).map(([ts, count]) => ({
      creationTimeSeconds: parseInt(ts, 10),
      count,
    }));

    res.json({
      platform: "leetcode",
      user: {
        username,
        ranking: u.profile?.ranking ?? "N/A",
        reputation: u.profile?.reputation ?? 0,
        rating: "N/A",
      },
      solved: u.submitStatsGlobal?.acSubmissionNum ?? [],
      submissions,
      lastActive: submissions.length ? submissions[submissions.length - 1].creationTimeSeconds : null,
      ratingHistory: [],
    });
  } catch (err) {
    console.error("LeetCode API error:", err.message);
    return res.status(500).json({ error: "Failed to fetch LeetCode" });
  }
});

module.exports = router;
