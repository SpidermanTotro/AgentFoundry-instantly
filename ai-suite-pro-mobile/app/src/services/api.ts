import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'https://3000-ibkwqvk5kfduhha5af04b-b9b802c4.sandbox.novita.ai';

export async function sendChatMessage(message: string) {
  // Placeholder implementation – will connect to real backend soon
  const response = await axios.post(`${API_BASE}/api/chat`, {
    message,
  });
  return response.data;
}
