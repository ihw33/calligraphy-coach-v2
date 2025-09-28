import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

// WebSocket 서버 (Figma 플러그인과 통신)
const wss = new WebSocketServer({ port: 8765 });
let figmaConnection: any = null;

// Express 서버 (상태 확인용)
const app = express();
app.use(cors());
app.use(express.json());

app.get('/status', (req, res) => {
  res.json({
    connected: figmaConnection !== null,
    serverRunning: true
  });
});

app.listen(3001, () => {
  console.log('🌐 상태 서버: http://localhost:3001');
});

// WebSocket 연결 관리
wss.on('connection', (ws) => {
  console.log('🔌 Figma 플러그인 연결됨');
  figmaConnection = ws;
});
