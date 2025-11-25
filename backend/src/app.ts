//It is a security policy area.
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import path from "path";

const app = express();

// 🔐 CORS – must be BEFORE routes
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Helpful middleware
//app.use(helmet());
// HELMET with custom CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "frame-ancestors": ["'self'", "http://localhost:5173"], // ★ FIX ★
      },
    },
  })
);


app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Simple test endpoints
app.get("/", (_req, res) => {
  res.send("EduSupportHub API running. Try /api/health");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// All main API routes
app.use("/api", router);

// Error handler (keep last)
app.use(errorMiddleware);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Upload path for assignment done from expert.
app.use(
  "/uploads/assignmentdone",
  express.static(path.join(__dirname, "../uploads/assignmentdone"))
);

export default app;
