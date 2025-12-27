const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const productsRouter = require("./routes/products.router");
const authRouter = require("./routes/auth.router");
const ordersRouter = require("./routes/orders.router"); 

// ===== App =====
const app = express();
app.set("trust proxy", 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS theo ENV
const allowOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
  })
);

// Body parser & logger
app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ===== API prefix v1 =====
const api = express.Router();

// Endpoint kiểm tra API sống
api.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "shoply-api",
    version: "v1",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Gắn các router chính
api.use("/auth", authRouter);
api.use("/products", productsRouter);
api.use("/orders", ordersRouter); 

// Dùng API router
app.use("/api/v1", api);

// ===== Root route =====
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "shoply-api",
    tip: "API health at /api/v1/health",
    version: "v1",
  });
});

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: { code: "NOT_FOUND", message: "Route not found", path: req.originalUrl },
  });
});

// Error Handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const code = err.code || (status === 500 ? "INTERNAL_ERROR" : "UNKNOWN_ERROR");
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", status, code, message, err.stack);
  }

  res.status(status).json({ ok: false, error: { code, message } });
});

module.exports = app;
