const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const cookiePath = path.join(__dirname, "mentorpick-cookies.json");

  if (!fs.existsSync(cookiePath)) {
    console.log("❌ Login cookies missing.");
    process.exit(1);
  }

  // Load cookies
  const cookieData = JSON.parse(fs.readFileSync(cookiePath, "utf8"));
  const cookies = cookieData.cookies;

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  await context.addCookies(cookies);

  const page = await context.newPage();
  const profileUrl = "https://mentorpick.com/profile/2310030017-karri_nilesh_r";

  console.log("Opening MentorPick…");
  await page.goto(profileUrl, { waitUntil: "networkidle" });

  await page.waitForTimeout(3000);

  // Extract Redux store (persist:root)
  const persistRoot = await page.evaluate(() => {
    return localStorage.getItem("persist:root");
  });

  if (!persistRoot) {
    console.log("❌ No persist:root found!");
    await browser.close();
    return;
  }

  // Parse
  const root = JSON.parse(persistRoot);

  // root contains nested JSON strings — we must parse them again
  function safeParse(str) {
    try { return JSON.parse(str); }
    catch { return {}; }
  }

  const user = safeParse(root.uuid);
  const token = safeParse(root.token);
  const username = root.userName?.replace(/"/g, "") || "";

  const output = {
    platform: "mentorpick",
    user: username,
    stats: {
      problemsSolved: root.problemsSolved ? Number(root.problemsSolved) : null,
      problemsAttempted: root.problemsAttempted ? Number(root.problemsAttempted) : null,
      accuracy: root.accuracy ? Number(root.accuracy) : null,
      contestsParticipated: root.contests ? Number(root.contests) : null,
      longestStreak: root.longestStreak ? Number(root.longestStreak) : null,
      currentStreak: root.currentStreak ? Number(root.currentStreak) : null,
      rating: root.rating ? Number(root.rating) : null
    },
    raw: root
  };

  console.log("\n📌 Extracted MentorPick Stats:");
  console.dir(output, { depth: null });

  await browser.close();
})();
