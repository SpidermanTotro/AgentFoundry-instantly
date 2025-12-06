# 📱 AI Suite Pro Mobile - Setup Plan

**Platform:** iOS + Android (React Native)  
**Goal:** Unified mobile app with all 5 desktop apps integrated  
**Timeline:** 2 weeks (Days 2-14)

---

## 🎯 PROJECT OVERVIEW

### **App Name:** AI Suite Pro Mobile
### **Bundle ID:** com.aisuitepro.mobile
### **Platforms:** 
- iOS 15.0+
- Android 10+

### **Features:**
- 5 main tabs (ChatGPT, GenSpark, Developer, GitHub, Tools)
- Voice input/output
- Camera integration
- Face ID / Touch ID
- Offline mode
- Push notifications

---

## 📅 DEVELOPMENT TIMELINE

### **Day 2-3: Project Setup**
```bash
# Initialize Expo project
npx create-expo-app@latest ai-suite-pro-mobile --template blank-typescript

# Install navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# Install state management
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query

# Install UI components
npm install react-native-paper
npm install react-native-vector-icons
npm install react-native-safe-area-context

# Install utilities
npm install axios
npm install react-native-webview
npm install @react-native-async-storage/async-storage
```

---

### **Day 4-5: Core Structure**

**1. Navigation Setup:**
```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="GenSpark" component={GenSparkScreen} />
        <Tab.Screen name="Developer" component={DeveloperScreen} />
        <Tab.Screen name="GitHub" component={GitHubScreen} />
        <Tab.Screen name="Tools" component={ToolsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

**2. Redux Store:**
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import gensparkReducer from './slices/gensparkSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    genspark: gensparkReducer,
    // ... other reducers
  },
});
```

---

### **Day 6-7: ChatGPT Tab**

**Features:**
- Message list (FlatList)
- Input field
- Send button
- AI response streaming
- Conversation history
- Export/import

**API Integration:**
```typescript
// services/api.ts
const API_BASE = 'https://your-backend.com'; // Update with actual URL

export const sendMessage = async (message: string) => {
  const response = await axios.post(`${API_BASE}/chat`, {
    message,
    model: 'gpt-4',
  });
  return response.data;
};
```

---

### **Day 8-9: GenSpark Tab**

**Features:**
- Offline AI selector
- GGUF model picker
- Generation options
- Results display
- GIF generator

---

### **Day 10-11: Developer Tab**

**Features:**
- Code editor (basic)
- File tree
- Generate code button
- WebSocket for live updates
- GitHub push integration

---

### **Day 12: GitHub + Tools Tabs**

**GitHub Tab:**
- Repository list
- Issue tracker
- PR viewer

**Tools Tab:**
- Game RE tools
- Binary analysis
- File upload

---

### **Day 13-14: Mobile Features**

**Voice I/O:**
```typescript
import Voice from '@react-native-voice/voice';

// Speech-to-text
Voice.start('en-US');

// Text-to-speech (platform native)
import Tts from 'react-native-tts';
Tts.speak('Hello World');
```

**Camera:**
```typescript
import { launchCamera } from 'react-native-image-picker';

const result = await launchCamera({
  mediaType: 'photo',
  quality: 0.8,
});
```

**Biometrics:**
```typescript
import ReactNativeBiometrics from 'react-native-biometrics';

const { success } = await ReactNativeBiometrics.simplePrompt({
  promptMessage: 'Authenticate',
});
```

---

## 📦 DEPENDENCIES

### **Core:**
- react-native: 0.73+
- expo: ~50.0
- typescript: 5.0+

### **Navigation:**
- @react-navigation/native: ^6.1.0
- @react-navigation/bottom-tabs: ^6.5.0
- @react-navigation/stack: ^6.3.0

### **State:**
- @reduxjs/toolkit: ^2.0.0
- react-redux: ^9.0.0

### **UI:**
- react-native-paper: ^5.12.0
- react-native-vector-icons: ^10.0.0

### **Mobile Features:**
- @react-native-voice/voice: ^3.2.0
- react-native-tts: ^4.1.0
- react-native-image-picker: ^7.1.0
- react-native-biometrics: ^3.0.0
- @react-native-async-storage/async-storage: ^1.23.0

---

## 🏗️ PROJECT STRUCTURE

```
ai-suite-pro-mobile/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── ChatHeader.tsx
│   │   ├── GenSpark/
│   │   ├── Developer/
│   │   ├── GitHub/
│   │   └── Tools/
│   ├── screens/
│   │   ├── ChatScreen.tsx
│   │   ├── GenSparkScreen.tsx
│   │   ├── DeveloperScreen.tsx
│   │   ├── GitHubScreen.tsx
│   │   └── ToolsScreen.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── store/
│   │   ├── index.ts
│   │   └── slices/
│   ├── services/
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── websocket.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── types/
│       └── index.ts
├── assets/
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🎨 UI/UX DESIGN

### **Theme:**
- Primary: #6366F1 (Indigo)
- Secondary: #8B5CF6 (Purple)
- Background: #1F2937 (Dark)
- Surface: #374151 (Dark Gray)
- Text: #F9FAFB (Light)

### **Bottom Tab Icons:**
- Chat: 💬 (chat-bubble)
- GenSpark: 🧠 (brain)
- Developer: 💻 (code)
- GitHub: 🔧 (github)
- Tools: 🛠️ (tools)

---

## 📱 BACKEND INTEGRATION

### **API Endpoints:**
```typescript
const endpoints = {
  // ChatGPT
  chat: '/api/chat',
  conversations: '/api/conversations',
  
  // GenSpark
  generate: '/api/generate',
  models: '/api/models',
  
  // Developer
  codeGen: '/api/code/generate',
  fileCreate: '/api/files/create',
  
  // GitHub
  repos: '/api/github/repos',
  issues: '/api/github/issues',
  
  // Tools
  extract: '/api/tools/extract',
  analyze: '/api/tools/analyze',
};
```

### **WebSocket:**
```typescript
// For real-time streaming
const ws = new WebSocket('ws://your-backend.com/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle streaming response
};
```

---

## 🧪 TESTING

### **Unit Tests:**
- Jest + React Native Testing Library
- Test components
- Test Redux actions/reducers

### **E2E Tests:**
- Detox for iOS/Android
- Test critical user flows

---

## 📦 BUILDING & DEPLOYMENT

### **iOS:**
```bash
# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### **Android:**
```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

---

## 🚀 NEXT STEPS

1. Complete desktop builds (today)
2. Initialize React Native project (tomorrow)
3. Setup navigation structure
4. Integrate first 3 tabs
5. Add mobile features
6. Test and polish
7. Submit to TestFlight

---

**Status:** Planning complete, ready to start Day 2!
