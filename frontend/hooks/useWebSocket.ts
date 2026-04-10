import { useEffect, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';

export const useWebSocket = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('✅ WebSocket ulandi');
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log('❌ WebSocket uzildi');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('❌ WebSocket xatosi:', error);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket xabar:', data);
      } catch (error) {
        console.error('WebSocket xabarni parse qilish xatosi:', error);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  return { ws, isConnected };
};
