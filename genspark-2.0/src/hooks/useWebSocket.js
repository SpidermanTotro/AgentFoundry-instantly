import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

// Use unified server port (3000) instead of original separate server port
export const useWebSocket = (url = 'http://localhost:3000') => {
  const [isConnected, setIsConnected] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messageBufferRef = useRef('');

  useEffect(() => {
    socketRef.current = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      setError(err.message);
      setIsConnected(false);
    });

    socket.on('chat:token', (data) => {
      messageBufferRef.current += data.token;
      setStreamingMessage(messageBufferRef.current);
    });

    socket.on('chat:complete', (data) => {
      console.log('✅ Streaming complete');
      messageBufferRef.current = '';
      setStreamingMessage('');
    });

    socket.on('chat:error', (error) => {
      console.error('Chat error:', error);
      setError(error.message);
      messageBufferRef.current = '';
      setStreamingMessage('');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [url]);

  const sendStreamingChat = (message, history = [], options = {}) => {
    if (!socketRef.current || !isConnected) {
      throw new Error('WebSocket not connected');
    }
    messageBufferRef.current = '';
    setStreamingMessage('');
    setError(null);
    socketRef.current.emit('chat:stream', { message, history, ...options });
  };

  const generateImage = (prompt, options = {}) => {
    if (!socketRef.current || !isConnected) {
      throw new Error('WebSocket not connected');
    }
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Image generation timeout')), 120000);
      socketRef.current.emit('image:generate', { prompt, ...options });
      socketRef.current.once('image:complete', (data) => { clearTimeout(timeoutId); resolve(data); });
      socketRef.current.once('image:error', (error) => { clearTimeout(timeoutId); reject(error); });
    });
  };

  return {
    isConnected,
    streamingMessage,
    error,
    socket: socketRef.current,
    sendStreamingChat,
    generateImage,
  };
};

export default useWebSocket;
