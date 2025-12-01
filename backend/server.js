const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const API_KEY = process.env.CF_KEY;
const API_SECRET = process.env.CF_SECRET;

function sign(method, params) {
  const rand = Math.random().toString(36).substring(2, 8);
  const time = Math.floor(Date.now() / 1000);

  const allParams = { apiKey: API_KEY, time, ...params };

  const sorted = Object.keys(allParams)
    .sort()
    .map((k) => `${k}=${allParams[k]}`)
    .join("&");

  const base = `${rand}/${method}?${sorted}#${API_SECRET}`;
  const hash = crypto.createHash("sha512").update(base).digest("hex");

  return { apiSig: rand + hash, sorted };
}

async function cfCall(method, params = {}) {
  const { apiSig, sorted } = sign(method, params);
  const url = `https://codeforces.com/api/${method}?${sorted}&apiSig=${apiSig}`;
  const res = await axios.get(url);
  return res.data;
}

app.get("/api/codeforces", async (req, res) => {
  const handle = req.query.handle || "nileshreddyk";

  try {
    const userInfo = await axios.get(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const rating = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );
    const submissions = await axios.get(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
    );

    res.json({
      user: userInfo.data.result[0],
      rating: rating.data.result,
      submissions: submissions.data.result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
const leetcodeRoute = require("./leetcode");
app.use("/api/leetcode", leetcodeRoute);
