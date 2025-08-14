// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Event } from "./models/events.js";

dotenv.config();

const app = express();

// ---- Config ----
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/finalexamDB";
const PORT = Number(process.env.PORT) || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// ---- Middleware ----
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// ---- Database ----
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---- Routes ----

// GET /api/events
// Optional ?keyword=...  (matches by location text OR rating 1–5)
app.get("/api/events", async (req, res) => {
  try {
    const { keyword: searchTerm } = req.query;
    let query = {};

    if (searchTerm && searchTerm.trim() !== "") {
      const parsedNumber = Number(searchTerm);
      const isRating =
        Number.isFinite(parsedNumber) && parsedNumber >= 1 && parsedNumber <= 5;

      query = isRating
        ? {
            $or: [
              { location: { $regex: searchTerm, $options: "i" } },
              { rating: parsedNumber },
            ],
          }
        : { location: { $regex: searchTerm, $options: "i" } };
    }

    const events = await Event.find(query).sort({ title: 1 });
    res.json(events);
  } catch (err) {
    console.error("GET /api/events error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET /api/events/:id
app.get("/api/events/:id", async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("GET /api/events/:id error:", err);
    res.status(400).json({ error: "Invalid event id" });
  }
});

// POST /api/events
app.post("/api/events", async (req, res) => {
  try {
    const newEventData = req.body;
    const createdEvent = await Event.create(newEventData);
    res.status(201).json(createdEvent);
  } catch (err) {
    console.error("POST /api/events error:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/events/:id
app.put("/api/events/:id", async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });
    res.json(updatedEvent);
  } catch (err) {
    console.error("PUT /api/events/:id error:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/events/:id
app.delete("/api/events/:id", async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const deletionResult = await Event.findByIdAndDelete(eventId);
    if (!deletionResult) return res.status(404).json({ error: "Event not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/events/:id error:", err);
    res.status(400).json({ error: err.message });
  }
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
