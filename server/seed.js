// server/seed.js
import mongoose from "mongoose";
import { Event } from "./models/events.js";

const uri = "mongodb://localhost:27017/finalexamDB";

const data = [
  {
    title: "Tech Expo 2025",
    img: "test.jpg",          // use a real filename if you have one in client/public/images
    location: "Vancouver",
    price: 25,
    rating: 4
  },
  {
    title: "Indie Music Night",
    img: "test.jpg",
    location: "Burnaby",
    price: 15,
    rating: 5
  },
  {
    title: "Food Truck Fest",
    img: "test.jpg",
    location: "Surrey",
    price: 10,
    rating: 3
  },
  {
    title: "Gaming LAN Party",
    img: "test.jpg",
    location: "Richmond",
    price: 5,
    rating: 4
  },
  {
    title: "Art Walk",
    img: "test.jpg",
    location: "Coquitlam",
    price: 0,
    rating: 2
  }
];

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected. Clearing old events...");
    await Event.deleteMany({});
    console.log("Inserting sample events...");
    await Event.insertMany(data);
    console.log("✅ Seed complete.");
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
