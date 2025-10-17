import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed-data";
import { seedLegalDocuments } from "./seed-legal";
import { seedAllMiningBrands } from "./mining-brands-seeder";
import { updateSectorPricing } from "./update-sector-pricing";
import { seedComprehensiveBrands } from "./comprehensive-brand-seeder";
import { seedMineNestComprehensive } from "./minenest-comprehensive-seeder";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Seed database with comprehensive brand data in development
  if (app.get("env") === "development") {
    try {
      await seedDatabase();
      await seedLegalDocuments();
      console.log("💰 Updating sector pricing structure...");
      await updateSectorPricing();

      console.log("🐻 Seeding Banimal ecosystem for charitable giving...");
      await storage.seedBanimalData();
      console.log("🎬 Seeding Motion, Media & Sonic engines...");
      await storage.seedMediaData();
      console.log("🚀 Seeding Omnilevel Interstellar operations...");
      await storage.seedInterstellarData();
    } catch (error) {
      console.error("Failed to seed database:", error);
    }
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  // Add error handling for port conflicts
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Server startup failed.`);
      console.log('💡 To fix this:');
      console.log('   1. Stop any other Node.js processes running on this port');
      console.log('   2. Wait a few seconds and try again');
      console.log('   3. Or restart the Replit environment');
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`🚀 Server successfully started on port ${port}`);
  });
})();
