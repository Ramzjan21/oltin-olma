const express = require('express');
const path = require('path');
const { createServer } = require('http');

// Import backend app
const backendApp = require('./backend/dist/index.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend/.next')));
app.use(express.static(path.join(__dirname, 'frontend/public')));

// Backend API routes
app.use('/api', backendApp);

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/.next/server/pages/index.html'));
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🌳 OLTIN OLMA DARAXT (PRODUCTION)      ║
║   🚀 Server ishga tushdi                  ║
║   📡 Port: ${PORT}                        ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
