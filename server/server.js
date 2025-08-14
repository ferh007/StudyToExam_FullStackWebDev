// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Event } from "./models/events.js";

const app = express();
app.use(cors());
app.use(express.json());

// === MongoDB connection (use local DB name required by exam) ===
const uri = "mongodb://localhost:27017/finalexamDB";
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// === Routes ===

// GET all events (optional filter by keyword => matches location OR rating)
app.get("/api/events", async (req, res) => {
  try {
    const { keyword } = req.query;
    let filter = {};
    if (keyword && keyword.trim() !== "") {
      const maybeNumber = Number(keyword);
      // If keyword is a number 1–5, match rating OR match location text
      const ratingMatch =
        !Number.isNaN(maybeNumber) && maybeNumber >= 1 && maybeNumber <= 5
          ? { rating: maybeNumber }
          : null;

      filter = ratingMatch
        ? { $or: [{ location: { $regex: keyword, $options: "i" } }, ratingMatch] }
        : { location: { $regex: keyword, $options: "i" } };
    }

    const events = await Event.find(filter).sort({ title: 1 });
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET single event by id (used by UpdateEvent.jsx)
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Not found" });
    res.json(event);
  } catch (e) {
    res.status(400).json({ error: "Invalid id" });
  }
});

// POST create (if you decide to add “Add Event” later)
app.post("/api/events", async (req, res) => {
  try {
    const doc = await Event.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT update (UpdateEvent.jsx uses this)
app.put("/api/events/:id", async (req, res) => {
  try {
    const doc = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE (optional)
app.delete("/api/events/:id", async (req, res) => {
  try {
    const r = await Event.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Start on required port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));
