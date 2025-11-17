// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import router from "./routes";
// import { errorMiddleware } from "./middlewares/errorMiddleware";

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(cookieParser());

// app.get("/", (_req, res) => {
//   res.send("EduSupportHub API running. Try /api/health");
// });

// app.get("/api/health", (_req, res) => {
//   res.json({ status: "ok" });
// });

// app.use("/api", router);

// app.use(errorMiddleware);

// export default app;
// // 




import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

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
app.use(helmet());
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

export default app;
