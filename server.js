// Simple JSON‑file DB + auth API
const fs   = require("fs");
const path = require("path");
const express = require("express");
const app  = express();

const DB_PATH = path.join(__dirname, "db.json");
const PORT    = process.env.PORT || 3000;

// ───────── Helpers ─────────
function readDb()  { return JSON.parse(fs.readFileSync(DB_PATH, "utf-8") || "[]"); }
function writeDb(x){ fs.writeFileSync(DB_PATH, JSON.stringify(x, null, 2)); }

// ───────── Middleware ─────────
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// ───────── Routes ─────────
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

  const users = readDb();
  if (users.find(u => u.email === email))
    return res.status(409).json({ error: "Email already registered" });

  const id = Date.now();                       // super‑simple id
  users.push({ id, name, email, password });
  writeDb(users);
  res.json({ message: "Signup OK", id });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = readDb().find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Bad credentials" });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.get("/api/user/:id", (req, res) => {
  const user = readDb().find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// ───────── Boot ─────────
app.listen(PORT, () => console.log(`⚡ Server running on http://localhost:${PORT}`));