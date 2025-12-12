import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface ChatState {
  messages: Message[];
  pending: boolean;
}

const initialState: ChatState = {
  messages: [
    {
      id: nanoid(),
      role: 'assistant',
      content: 'Hi! I\'m your AI co-pilot. Ask me anything to get started.',
      createdAt: new Date().toISOString(),
    },
  ],
  pending: false,
};

interface AddMessagePayload {
  role: MessageRole;
  content: string;
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<AddMessagePayload>) => {
      state.messages.push({
        id: nanoid(),
        role: action.payload.role,
        content: action.payload.content.trim(),
        createdAt: new Date().toISOString(),
      });
    },
    setPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload;
    },
    resetChat: () => initialState,
  },
});

export const { addMessage, setPending, resetChat } = chatSlice.actions;

export default chatSlice.reducer;
