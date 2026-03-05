import express from "express";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./src/server/routes/user.routes";
import authRoutes from "./src/server/routes/auth.routes";
import subscriptionRoutes from "./src/server/routes/subscription.routes";
import metricsRoutes from "./src/server/routes/metrics.routes";
import adminRoutes from "./src/server/routes/admin.routes";
import { handleStripeWebhook } from "./src/server/controllers/webhook.controller";
import { apiLimiter } from "./src/server/middlewares/rate-limit.middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;

// Trust proxy for rate limiting behind Nginx
app.set('trust proxy', 1);

// Webhook must be parsed as raw body for signature verification
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/admin", adminRoutes);

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
app.post("/api/staging/save", async (req, res) => {
  try {
    const { imageUrl, resultUrls, style } = req.body;
    
    if (!imageUrl || !resultUrls || !style) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

    res.json({ success: true });
  } catch (error) {
    console.error("Staging save error:", error);
    res.status(500).json({ error: "Failed to save staging" });
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
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
