const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import backend routes (after build)
let authRoutes, treeRoutes, adminRoutes;
try {
  authRoutes = require('./backend/dist/routes/auth.js').default;
  treeRoutes = require('./backend/dist/routes/tree.js').default;
  adminRoutes = require('./backend/dist/routes/admin.js').default;
} catch (error) {
  console.error('Backend routes not found. Make sure to run build first.');
}

// Backend API routes
if (authRoutes && treeRoutes && adminRoutes) {
  app.use('/api/auth', authRoutes);
  app.use('/api/tree', treeRoutes);
  app.use('/api/admin', adminRoutes);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server ishlayapti' });
});

// Serve Next.js frontend (standalone mode)
const frontendPath = path.join(__dirname, 'frontend/.next/standalone');
const publicPath = path.join(__dirname, 'frontend/public');
const staticPath = path.join(__dirname, 'frontend/.next/static');

// Serve static files
app.use('/_next/static', express.static(path.join(__dirname, 'frontend/.next/static')));
app.use('/static', express.static(publicPath));

// Serve Next.js app
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  try {
    // Try to serve from Next.js standalone
    const nextServer = require(path.join(frontendPath, 'server.js'));
    return nextServer.default(req, res);
  } catch (error) {
    // Fallback to static HTML
    res.sendFile(path.join(__dirname, 'frontend/out/index.html'));
  }
});

// HTTP Server
const server = createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('✅ WebSocket client ulandi');

  ws.on('message', (message) => {
    console.log('📨 Xabar olindi:', message.toString());
  });

  ws.on('close', () => {
    console.log('❌ WebSocket client uzildi');
  });

  // Har 30 sekundda ping yuborish
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
    }
  }, 30000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server xatosi:', err);
  res.status(500).json({ success: false, message: 'Server xatosi' });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🌳 OLTIN OLMA DARAXT (PRODUCTION)      ║
║   🚀 Server ishga tushdi                  ║
║   📡 Port: ${PORT}                        ║
║   🌐 Frontend + Backend birga             ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
