import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/parse", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "缺少url参数" });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "无标题";

    const image =
      $('meta[property="og:image"]').attr("content") || "";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      "无描述";

    res.json({ title, image, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "解析失败" });
  }
});

app.listen(3001, () => {
  console.log("✅ Server running: http://localhost:3001");
});
