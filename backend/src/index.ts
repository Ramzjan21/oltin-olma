import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import authRoutes from './routes/auth';
import treeRoutes from './routes/tree';
import adminRoutes from './routes/admin';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tree', treeRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server ishlayapti' });
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

// Global WebSocket broadcast funksiyasi
export const broadcastToAll = (data: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server xatosi:', err);
  res.status(500).json({ success: false, message: 'Server xatosi' });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🌳 OLTIN OLMA DARAXT SERVER            ║
║   🚀 Server ishga tushdi                  ║
║   📡 Port: ${PORT}                        ║
║   🌐 URL: http://localhost:${PORT}        ║
║   ⚡ WebSocket: ws://localhost:${PORT}    ║
╚═══════════════════════════════════════════╝
  `);
});

export default app;
