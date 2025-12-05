import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { useDropzone } from 'react-dropzone';
import { 
  FaPaperPlane, FaImage, FaVideo, FaMusic, FaFile, FaSearch, 
  FaMicrophone, FaStop, FaDownload, FaTrash, FaSun, FaMoon,
  FaCog, FaPlus, FaHistory, FaRobot, FaCode, FaLightbulb
} from 'react-icons/fa';
import './ChatGPT2.css';

const ChatGPT2 = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `# Welcome to ChatGPT 2.0 UNRESTRICTED! 🚀

I'm your ultimate AI assistant with **ZERO RESTRICTIONS** and **ALL FEATURES**:

## 🎯 What I Can Do:
- 💬 **Unlimited Chat** - No filters, no restrictions
- 🌐 **Real-time Web Browsing** - Search and crawl any website
- 🎨 **Image Generation** - DALL-E 3, Stable Diffusion XL
- 🎬 **Video Generation** - Create videos from text/images
- 🎵 **Audio & Music** - TTS, voice cloning, music generation
- 📄 **Document Processing** - PDF, DOCX, images (OCR)
- 💻 **Code Execution** - Run code directly
- 📁 **File System Access** - Read/write files
- 🐙 **GitHub Integration** - Manage repos, PRs, issues
- 🧠 **Persistent Memory** - Remember across conversations
- 🎭 **Multiple Personalities** - Different AI modes
- 🔒 **100% Offline Mode** - Works without internet

## 🔥 Unique Features ChatGPT Can't Do:
✓ Unrestricted content generation
✓ Direct file system access
✓ Real-time web browsing
✓ GitHub API integration
✓ Multi-modal creation (image/video/audio)
✓ Code execution without sandboxing
✓ Complete privacy (self-hosted)

**Try me!** Ask anything, generate anything, do anything! 😎`,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('chat');
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'ChatGPT 2.0 UNRESTRICTED', date: new Date() }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const onDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        await processDocument(file, content);
      };
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const { getRootProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: true 
  });

  const processDocument = async (file, content) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: `[Uploaded: ${file.name}]`,
      timestamp: new Date(),
      type: 'file',
      file: { name: file.name, type: file.type, content }
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process-document', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.analysis || data.text || 'Document processed successfully!',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (customMessage = null) => {
    const messageText = customMessage || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      if (messageText.startsWith('/image ')) {
        await generateImage(messageText.substring(7));
      } else if (messageText.startsWith('/video ')) {
        await generateVideo(messageText.substring(7));
      } else if (messageText.startsWith('/audio ')) {
        await generateAudio(messageText.substring(7));
      } else if (messageText.startsWith('/search ')) {
        await webSearch(messageText.substring(8));
      } else if (messageText.startsWith('/crawl ')) {
        await webCrawl(messageText.substring(7));
      } else if (messageText.startsWith('/code ')) {
        await executeCode(messageText.substring(6));
      } else {
        await chatWithAI(messageText);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  const chatWithAI = async (message) => {
    const response = await fetch('/api/chatgpt2/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationHistory: messages.slice(-10).map(m => ({
          role: m.role,
          content: m.content
        })),
        mode,
        useMemory: true
      })
    });

    const data = await response.json();
    
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: data.response || data.message || 'No response',
      timestamp: new Date(),
      type: 'text',
      metadata: data.metadata
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const generateImage = async (prompt) => {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model: 'dall-e-3',
        size: '1024x1024'
      })
    });

    const data = await response.json();
    
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `Generated image: "${prompt}"`,
      timestamp: new Date(),
      type: 'image',
      imageUrl: data.imageUrl || data.url
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const generateVideo = async (prompt) => {
    const loadingMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '🎬 Generating video... This may take 1-2 minutes.',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, loadingMsg]);

    const response = await fetch('/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        duration: 5
      })
    });

    const data = await response.json();
    
    const aiMessage = {
      id: Date.now() + 2,
      role: 'assistant',
      content: `Generated video: "${prompt}"`,
      timestamp: new Date(),
      type: 'video',
      videoUrl: data.videoUrl || data.url
    };
    
    setMessages(prev => [...prev.slice(0, -1), aiMessage]);
  };

  const generateAudio = async (text) => {
    const response = await fetch('/api/generate-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice: 'alloy'
      })
    });

    const data = await response.json();
    
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `Generated audio: "${text}"`,
      timestamp: new Date(),
      type: 'audio',
      audioUrl: data.audioUrl || data.url
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const webSearch = async (query) => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    
    const results = data.results || data.organic_results || [];
    const formattedResults = results.slice(0, 5).map((r, i) => 
      `${i + 1}. **${r.title}**\n   ${r.snippet || r.description}\n   [${r.link}](${r.link})`
    ).join('\n\n');

    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `# 🔍 Search Results for: "${query}"\n\n${formattedResults}`,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const webCrawl = async (url) => {
    const loadingMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `🕷️ Crawling ${url}...`,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, loadingMsg]);

    const response = await fetch('/api/crawl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    
    const aiMessage = {
      id: Date.now() + 2,
      role: 'assistant',
      content: `# 📄 Crawled: ${url}\n\n${data.content || data.text || 'Content extracted'}`,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev.slice(0, -1), aiMessage]);
  };

  const executeCode = async (code) => {
    const response = await fetch('/api/chatgpt2/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await response.json();
    
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `## Code Execution:\n\`\`\`\n${data.output || data.result}\n\`\`\``,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newConversation = () => {
    const newId = Date.now();
    const newConv = {
      id: newId,
      title: 'New Conversation',
      date: new Date()
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newId);
    setMessages([{
      id: 1,
      role: 'assistant',
      content: '👋 New conversation started! How can I help?',
      timestamp: new Date(),
      type: 'text'
    }]);
  };

  const exportConversation = () => {
    const content = messages.map(m => 
      `${m.role.toUpperCase()}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${Date.now()}.txt`;
    a.click();
  };

  const quickPrompts = [
    { icon: '🎨', text: '/image Beautiful sunset landscape', label: 'Generate Image' },
    { icon: '🎬', text: '/video Flying bird animation', label: 'Generate Video' },
    { icon: '🔍', text: '/search Latest AI news', label: 'Web Search' },
    { icon: '💻', text: 'Write Python sort function', label: 'Code Help' },
    { icon: '📄', text: 'Summarize document', label: 'Document AI' },
    { icon: '🎵', text: '/audio Meditation music', label: 'Generate Audio' }
  ];

  return (
    <div className={`chatgpt2-container ${theme}`} {...getRootProps()}>
      {isDragActive && (
        <div className="drag-overlay">
          <FaFile size={48} />
          <p>Drop files here...</p>
        </div>
      )}

      {showSidebar && (
        <div className="chatgpt2-sidebar">
          <div className="sidebar-header">
            <button className="new-chat-btn" onClick={newConversation}>
              <FaPlus /> New Chat
            </button>
          </div>
          
          <div className="conversations-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
                onClick={() => setCurrentConversationId(conv.id)}
              >
                <FaHistory />
                <div className="conversation-info">
                  <span className="conversation-title">{conv.title}</span>
                  <span className="conversation-date">
                    {conv.date.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <button className="sidebar-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <FaSun /> : <FaMoon />} Theme
            </button>
            <button className="sidebar-btn">
              <FaCog /> Settings
            </button>
          </div>
        </div>
      )}

      <div className="chatgpt2-main">
        <div className="chatgpt2-header">
          <button 
            className="toggle-sidebar-btn"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </button>
          
          <div className="header-title">
            <FaRobot className="header-icon" />
            <div>
              <h2>ChatGPT 2.0 UNRESTRICTED</h2>
              <span className="header-subtitle">
                {mode === 'chat' && '💬 Chat Mode'}
                {mode === 'code' && '💻 Code Mode'}
                {mode === 'creative' && '🎨 Creative Mode'}
              </span>
            </div>
          </div>

          <div className="header-actions">
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className="mode-select"
            >
              <option value="chat">💬 Chat</option>
              <option value="code">💻 Code</option>
              <option value="creative">🎨 Creative</option>
            </select>
            
            <button className="header-btn" onClick={exportConversation}>
              <FaDownload /> Export
            </button>
          </div>
        </div>

        <div className="chatgpt2-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              
              <div className="message-content">
                {message.type === 'text' && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={theme === 'dark' ? vscDarkPlus : vs}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
                
                {message.type === 'image' && (
                  <div className="message-media">
                    <img src={message.imageUrl} alt="Generated" />
                    <p>{message.content}</p>
                  </div>
                )}
                
                {message.type === 'video' && (
                  <div className="message-media">
                    <video src={message.videoUrl} controls />
                    <p>{message.content}</p>
                  </div>
                )}
                
                {message.type === 'audio' && (
                  <div className="message-media">
                    <audio src={message.audioUrl} controls />
                    <p>{message.content}</p>
                  </div>
                )}

                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && !streamingMessage && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="quick-prompts">
            <h4>🚀 Try these:</h4>
            <div className="prompts-grid">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  className="quick-prompt-btn"
                  onClick={() => sendMessage(prompt.text)}
                >
                  <span className="prompt-icon">{prompt.icon}</span>
                  <span className="prompt-label">{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chatgpt2-input-container">
          <div className="input-actions">
            <button 
              className="action-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaFile />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onDrop([e.target.files[0]]);
                }
              }}
            />
            
            <button className="action-btn" onClick={() => setIsRecording(!isRecording)}>
              {isRecording ? <FaStop className="recording" /> : <FaMicrophone />}
            </button>
            
            <button className="action-btn" title="Image">
              <FaImage />
            </button>
            
            <button className="action-btn" title="Video">
              <FaVideo />
            </button>
            
            <button className="action-btn" title="Audio">
              <FaMusic />
            </button>
            
            <button className="action-btn" title="Search">
              <FaSearch />
            </button>
          </div>

          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message ChatGPT 2.0... (try /image, /video, /audio, /search)"
              className="chat-input"
              rows="1"
            />
            
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="send-btn"
            >
              <FaPaperPlane />
            </button>
          </div>

          <div className="input-help">
            💡 Use /image, /video, /audio, /search, /crawl, /code commands
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPT2;
