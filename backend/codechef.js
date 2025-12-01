const puppeteer = require("puppeteer");

(async () => {
  const user = "nileshhh_21";
  const url = `https://www.codechef.com/users/${user}`;

  console.log("Launching browser…");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  // Track ALL network requests
  page.on("response", async (res) => {
    const req = res.request();

    if (req.url().includes("ratings") || req.url().includes("graph")) {
      console.log("📡 Captured rating request:", req.url());

      try {
        const json = await res.json();
        console.log("📊 Rating Data:");
        console.log(json);
      } catch (e) {
        console.log("❌ Could not parse rating response:", e.message);
      }
    }
  });

  console.log("Opening profile:", url);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  console.log("✔️ Page loaded. Waiting for any rating graph requests…");

  await page.waitForTimeout(5000);

  await browser.close();
})();
