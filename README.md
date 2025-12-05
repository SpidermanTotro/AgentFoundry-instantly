# 🤖 AI Copilot Dev

Your AI-Powered Coding Assistant - A modern, web-based development environment with intelligent code suggestions, real-time assistance, and multi-language support.

![AI Copilot Dev](https://img.shields.io/badge/AI-Copilot-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-ISC-green?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen?style=for-the-badge)

## ✨ Features

### 🎯 Core Features
- **Real-time Code Suggestions** - Get intelligent code completions as you type
- **AI Chat Assistant** - Ask questions and get instant help with your code
- **Code Explanation** - Understand complex code with AI-powered explanations
- **Refactoring Suggestions** - Improve code quality with smart refactoring tips
- **Multi-language Support** - JavaScript, TypeScript, Python, Java, C++, Go, Rust, and more
- **Monaco Editor** - VS Code-like editing experience in your browser
- **Dark/Light Theme** - Toggle between themes for comfortable coding

### 💬 Chat Features
- Quick action buttons for common tasks
- Context-aware responses based on your current code
- Real-time typing indicators
- Message history with timestamps
- Beautiful gradient UI design

### 🎨 User Interface
- Modern, responsive design
- Gradient color schemes
- Smooth animations and transitions
- Mobile-friendly layout
- Split-panel view with resizable sections

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd webapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key (optional for demo)
```

4. **Start the application**

**Option 1: Start both frontend and backend**
```bash
npm start
```

**Option 2: Start them separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Project Structure

```
webapp/
├── src/
│   ├── components/
│   │   ├── ChatPanel.jsx         # AI chat interface
│   │   ├── ChatPanel.css
│   │   ├── CodeAssistant.jsx     # Code suggestion panel
│   │   └── CodeAssistant.css
│   ├── App.jsx                   # Main application
│   ├── App.css                   # Main styles
│   └── main.jsx                  # React entry point
├── server/
│   └── index.js                  # Express backend server
├── public/                       # Static assets
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Monaco Editor** - VS Code's editor component
- **Axios** - HTTP client for API calls

### Backend
- **Express.js** - Web application framework
- **OpenAI API** - AI-powered code assistance (optional)
- **CORS** - Cross-origin resource sharing
- **WebSocket** - Real-time communication support

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Code Completion
```
POST /api/complete
Body: { code, language, cursorPosition }
Response: { success, suggestions[] }
```

### Chat Assistant
```
POST /api/chat
Body: { message, code, context }
Response: { success, response, timestamp }
```

### Code Explanation
```
POST /api/explain
Body: { code, language }
Response: { success, explanation }
```

### Refactoring Suggestions
```
POST /api/refactor
Body: { code, language, focus }
Response: { success, suggestions[] }
```

## 🎮 Usage

### Getting Code Suggestions
1. Type your code in the editor
2. Click the "✨ Get Suggestion" button
3. Review AI-generated suggestions
4. Apply or modify as needed

### Using the Chat Assistant
1. Click "💬 Show Chat" to open the chat panel
2. Ask questions or use quick action buttons
3. Get instant AI-powered responses
4. Continue the conversation for follow-up questions

### Explaining Code
1. Write or paste code in the editor
2. Click "📖 Explain Code"
3. Read the detailed explanation in a popup

### Refactoring Code
1. Select the code you want to improve
2. Click "🔧 Refactor"
3. Review refactoring suggestions
4. Apply recommended changes

## 🔧 Configuration

### OpenAI API (Optional)
To use real AI features instead of mock responses:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add to your `.env` file:
```
OPENAI_API_KEY=sk-your-api-key-here
```
3. Restart the server

### Customizing Languages
Edit the `languages` array in `src/App.jsx`:
```javascript
const languages = [
  'javascript', 'typescript', 'python', 'java', // add more
];
```

## 🎨 Customization

### Changing Themes
The app uses gradient color schemes. Modify in CSS files:
- Primary gradient: `#667eea` → `#764ba2`
- Secondary gradient: `#f093fb` → `#f5576c`

### Editor Settings
Customize Monaco editor in `src/App.jsx`:
```javascript
options={{
  fontSize: 14,
  minimap: { enabled: true },
  // add more options
}}
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 or 3001 is taken:
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📝 Development

### Adding New Features
1. Create component in `src/components/`
2. Add styles in corresponding CSS file
3. Import and use in `App.jsx`
4. Add API endpoint in `server/index.js` if needed

### Running in Production
```bash
# Build frontend
npm run build

# Serve with production server
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code's editor
- [OpenAI](https://openai.com/) - AI capabilities
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI framework

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ using AI and modern web technologies**
