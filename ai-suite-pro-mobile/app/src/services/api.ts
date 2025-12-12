import axios from 'axios';

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ?? 'https://3000-ibkwqvk5kfduhha5af04b-b9b802c4.sandbox.novita.ai';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export type ChatHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

export interface ChatResponse {
  success?: boolean;
  message?: string;
  info?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export async function sendChatMessage(message: string, history: ChatHistoryItem[]) {
  const response = await apiClient.post<ChatResponse>('/api/chat', {
    message,
    history,
    stream: false,
  });

  return response.data;
}
