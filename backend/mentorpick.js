const axios = require("axios");
const fs = require("fs");

const session = JSON.parse(fs.readFileSync("./mentorpick-session.json", "utf8"));

async function fetchMentorPickStats() {
  try {
    const res = await axios.post(
      "https://mentorpick.com/api/v1/profile/get-user",
      {
        username: session.userName.replace(/"/g, "")
      },
      {
        headers: {
          Authorization: `Bearer ${session.token.replace(/"/g, "")}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = res.data;

    const output = {
      platform: "mentorpick",
      user: {
        name: data?.data?.name || "Unknown",
        handle: session.userName.replace(/"/g, ""),
        email: session.email.replace(/"/g, "")
      },
      stats: {
        problemsSolved: data?.data?.overallStats?.problemsSolved || 0,
        problemsAttempted: data?.data?.overallStats?.problemsAttempted || 0,
        accuracy: data?.data?.overallStats?.accuracy || 0,
        contestsParticipated: data?.data?.overallStats?.contestsParticipated || 0,
        longestStreak: data?.data?.overallStats?.longestStreak || 0,
        currentStreak: data?.data?.overallStats?.currentStreak || 0,
        rating: data?.data?.overallStats?.rating || 0
      }
    };

    console.log(JSON.stringify(output, null, 2));

  } catch (err) {
    console.log("❌ Error:", err.response?.data || err);
  }
}

fetchMentorPickStats();
