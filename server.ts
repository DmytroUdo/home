import express from "express";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Lazy Initialize Gemini
let aiClient: GoogleGenAI | null = null;
function getAi() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Lazy Initialize Replicate
let replicateClient: Replicate | null = null;
function getReplicate() {
  if (!replicateClient) {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error("REPLICATE_API_TOKEN is not set");
    replicateClient = new Replicate({ auth: token });
  }
  return replicateClient;
}

// Lazy Initialize Supabase
let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      supabaseClient = createClient(url, key);
    }
  }
  return supabaseClient;
}

// --- API ROUTES ---

// Staging API
app.post("/api/staging", async (req, res) => {
  try {
    const { imageUrl, style } = req.body;
    
    if (!imageUrl || !style) {
      return res.status(400).json({ error: "Missing imageUrl or style" });
    }

    let replicate;
    try {
      replicate = getReplicate();
    } catch (e: any) {
      return res.status(400).json({ error: "API ключ Replicate не налаштовано. Додайте REPLICATE_API_TOKEN." });
    }

    // Call Replicate
    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      {
        input: {
          image: imageUrl,
          prompt: style,
        }
      }
    );

    const resultUrls = Array.isArray(output) ? output : [output];

    // Save job to database
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('staging_jobs').insert({
        original_image_url: imageUrl,
        result_urls: resultUrls,
        style: style,
        status: 'completed'
      });
    }

    res.json({ resultUrls });
  } catch (error) {
    console.error("Staging error:", error);
    res.status(500).json({ error: "Failed to generate staging" });
  }
});

// Save Estimate API
app.post("/api/save-estimate", async (req, res) => {
  try {
    const { input_data, result } = req.body;

    // Save to database
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('estimations').insert({
        input_data,
        result
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Save estimate error:", error);
    res.status(500).json({ error: "Failed to save estimate" });
  }
});

// Save Renovation API
app.post("/api/save-renovation", async (req, res) => {
  try {
    const { city, area, description, result } = req.body;

    // Save to database
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('renovation_quotes').insert({
        description,
        city,
        area,
        result
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Save renovation error:", error);
    res.status(500).json({ error: "Failed to save renovation" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
