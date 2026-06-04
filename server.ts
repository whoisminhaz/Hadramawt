import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Simple file-based database for development
const DB_FILE = path.join(process.cwd(), "db.json");

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      menu: [
        { id: "1", name: "Chicken Mandi", description: "Traditional Yemeni rice dish with slow-cooked chicken.", price: 25.0, category: "Main Course", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600" },
        { id: "2", name: "Lamb Kabsa", description: "Spiced basmati rice with tender lamb.", price: 35.0, category: "Main Course", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600" },
        { id: "3", name: "Kunafa", description: "Traditional Middle Eastern sweet made with spun pastry and cheese.", price: 15.0, category: "Dessert", image: "https://images.unsplash.com/photo-1541783245831-57d6fb0936d5?auto=format&fit=crop&q=80&w=600" },
        { id: "4", name: "Mint Margarita", description: "Refreshing blend of mint, lemon, and ice.", price: 10.0, category: "Drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600" },
      ],
      orders: [],
      reservations: [],
      reviews: [
        { id: "1", author: "Ahmad", rating: 5, comment: "Best Mandi in town! Highly recommend.", date: new Date().toISOString() },
        { id: "2", author: "Sarah", rating: 4, comment: "Great food, fast service.", date: new Date().toISOString() }
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // Menu
  app.get("/api/menu", (req, res) => {
    const db = readDB();
    res.json(db.menu);
  });
  
  app.post("/api/menu", (req, res) => {
    const db = readDB();
    const newItem = { ...req.body, id: Date.now().toString() };
    db.menu.push(newItem);
    writeDB(db);
    res.json(newItem);
  });
  
  app.delete("/api/menu/:id", (req, res) => {
    const db = readDB();
    db.menu = db.menu.filter((i: any) => i.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
  });

  // Orders
  app.get("/api/orders", (req, res) => {
    const db = readDB();
    res.json(db.orders);
  });
  
  app.get("/api/orders/:id", (req, res) => {
    const db = readDB();
    const order = db.orders.find((o: any) => o.id === req.params.id);
    if(order) res.json(order);
    else res.status(404).json({error: "Not found"});
  });
  
  app.post("/api/orders", (req, res) => {
    const db = readDB();
    const newOrder = { 
      ...req.body, 
      id: "ORD" + Math.floor(Math.random() * 10000),
      status: "Preparing",
      date: new Date().toISOString() 
    };
    db.orders.push(newOrder);
    writeDB(db);
    res.json(newOrder);
  });
  
  app.put("/api/orders/:id", (req, res) => {
    const db = readDB();
    const index = db.orders.findIndex((o: any) => o.id === req.params.id);
    if (index !== -1) {
      db.orders[index] = { ...db.orders[index], ...req.body };
      writeDB(db);
      res.json(db.orders[index]);
    } else {
      res.status(404).json({error: "Not found"});
    }
  });

  // Reservations
  app.get("/api/reservations", (req, res) => {
    const db = readDB();
    res.json(db.reservations);
  });
  
  app.post("/api/reservations", (req, res) => {
    const db = readDB();
    const newReservation = { 
      ...req.body, 
      id: "RES" + Math.floor(Math.random() * 10000),
      status: "Confirmed",
      date: new Date().toISOString() 
    };
    db.reservations.push(newReservation);
    writeDB(db);
    res.json(newReservation);
  });
  
  app.put("/api/reservations/:id", (req, res) => {
    const db = readDB();
    const index = db.reservations.findIndex((r: any) => r.id === req.params.id);
    if (index !== -1) {
      db.reservations[index] = { ...db.reservations[index], ...req.body };
      writeDB(db);
      res.json(db.reservations[index]);
    } else {
      res.status(404).json({error: "Not found"});
    }
  });

  // Reviews
  app.get("/api/reviews", (req, res) => {
    const db = readDB();
    res.json(db.reviews);
  });
  
  app.post("/api/reviews", (req, res) => {
    const db = readDB();
    const newReview = { ...req.body, id: Date.now().toString(), date: new Date().toISOString() };
    db.reviews.push(newReview);
    writeDB(db);
    res.json(newReview);
  });
  
  app.delete("/api/reviews/:id", (req, res) => {
    const db = readDB();
    db.reviews = db.reviews.filter((r: any) => r.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
