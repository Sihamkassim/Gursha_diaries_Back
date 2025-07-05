require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authRouter = require("./src/routes/authRouter");
const itemRoute = require("./src/routes/itemRoute");
const categoryRoute = require("./src/routes/categoryRoute");
const adminRoute = require("./src/routes/adminRoute");

const app = express();
const PORT = process.env.PORT || 8000;

// Global Middlewares
app.use(helmet());

// Body parsing middleware must come before routes
app.use(cookieParser());
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set up CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/", itemRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/admin", adminRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Hello, Gursha Diaries 👋🍲");
});

// DB + Server Startup
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

startServer();
