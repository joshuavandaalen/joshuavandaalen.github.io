const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

// Visitor counter route
app.get("/api/visitors", (req, res) => {
  const counterFile = path.join(__dirname, "visitors.txt");
  let count = 0;

  if (fs.existsSync(counterFile)) {
    count = parseInt(fs.readFileSync(counterFile, "utf8") || "0", 10);
  }

  count++;
  fs.writeFileSync(counterFile, count.toString());

  res.json({ count });
});

// Routes (before static middleware)
app.get("/agenda/:year", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "agenda.html"));
});

app.get("/agenda", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "agenda.html"));
});

// Serve static files from public directory
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🌟 DDD Melbourne - 90s Edition 🌟          ║
║  Server running on http://localhost:${PORT}     ║
║  Best viewed in Netscape Navigator 4.0!      ║
╚═══════════════════════════════════════════════╝
    `);
});
