import express from "express";
import noblox from "noblox.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const APP_KEY = process.env.APP_KEY;
const ROBLOSECURITY = process.env.ROBLOSECURITY;

(async () => {
  await noblox.setCookie(ROBLOSECURITY);
  console.log("noblox.js logged in");
})().catch(err => {
  console.error("Noblox login failed:", err);
  process.exit(1);
});

function checkKey(req, res, next) {
  if (req.headers["x-app-key"] !== APP_KEY) return res.status(401).json({ ok:false, error:"unauthorized" });
  next();
}

app.get("/health", (_req, res) => res.json({ ok:true }));
app.post("/set-rank", checkKey, async (req, res) => {
  try {
    const { groupId, userId, roleId } = req.body || {};
    if (!groupId || !userId || !roleId) return res.status(400).json({ ok:false, error:"missing fields" });
    const result = await noblox.setRank(Number(groupId), Number(userId), Number(roleId));
    res.json({ ok:true, result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:String(e) });
  }
});

app.listen(PORT, () => console.log("Rank service listening on", PORT));
