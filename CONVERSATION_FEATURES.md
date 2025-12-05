# Complete Conversation Management System

## Overview

ChatGPT 2.0 includes a complete conversation management system with:
- Auto-save & persistence
- Conversation merging
- Search & filter
- Import/export
- Tags & organization
- Analytics & statistics

All conversations are automatically saved to browser localStorage.

## Key Features

### 1. Auto-Save & Persistence
- All conversations automatically saved
- Messages saved in real-time
- Survives browser refresh
- No server required

### 2. Conversation Management
- Create unlimited conversations
- Switch between conversations instantly
- Rename with custom titles
- Delete conversations
- Archive old conversations
- Search across all conversations

### 3. Merge Conversations
- Merge 2+ conversations into one
- Automatic chronological ordering
- Preserves all messages
- Adds separator markers
- Combines tags

### 4. Import/Export
- Export single conversation to JSON
- Export all conversations
- Import conversations from JSON
- Share conversations
- Backup your data

### 5. Search & Filter
- Search by title, content, tags
- Filter by date range
- Filter by archived status
- Filter by message count
- Sort by multiple criteria

### 6. Tags & Organization
- Add custom tags
- Filter by tags
- View all tags
- Tag-based categorization

### 7. Analytics
- Total conversation count
- Total message count
- Average messages per conversation
- Most active conversation
- Storage size tracking

## How to Use

### Creating New Conversation
```
1. Click "+ New Chat" button in sidebar
2. Start chatting immediately
3. Auto-saves as you type
4. Title auto-generated
```

### Merging Conversations
```javascript
// Select conversation IDs
const ids = [123, 456, 789];

// Merge them
const result = conversationManager.mergeConversations(
  ids,
  'My Merged Conversation'
);

// Load merged conversation
if (result.success) {
  setCurrentConversationId(result.conversation.id);
  setMessages(result.conversation.messages);
}
```

### Export/Import
```javascript
// Export single conversation
const result = conversationManager.exportConversation(id);
// Download JSON file

// Import conversations
const result = conversationManager.importConversation(jsonData);
```

### Search
```javascript
// Search all conversations
const results = conversationManager.searchConversations('AI research');
```

### Tags
```javascript
// Add tag
conversationManager.addTag(conversationId, 'work');

// Get all tags
const tags = conversationManager.getAllTags();
```

### Analytics
```javascript
// Get statistics
const stats = conversationManager.getStatistics();
/*
{
  total: 25,
  archived: 3,
  active: 22,
  totalMessages: 450,
  avgMessagesPerConv: 18,
  tags: { 'work': 12, 'personal': 8 }
}
*/
```

## API Reference

### ConversationManager Methods

| Method | Description |
|--------|-------------|
| `loadConversations()` | Load all conversations |
| `saveConversation(conv)` | Save/update conversation |
| `getConversation(id)` | Get single conversation |
| `deleteConversation(id)` | Delete conversation |
| `archiveConversation(id)` | Archive conversation |
| `mergeConversations(ids, title)` | Merge conversations |
| `searchConversations(query)` | Search conversations |
| `sortConversations(convs, by, order)` | Sort conversations |
| `exportConversation(id)` | Export to JSON |
| `exportAllConversations()` | Export all to JSON |
| `importConversation(json)` | Import from JSON |
| `addTag(id, tag)` | Add tag to conversation |
| `getAllTags()` | Get all tags |
| `getStatistics()` | Get statistics |
| `updateTitle(id, title)` | Update conversation title |
| `clearAllConversations()` | Clear all conversations |
| `getStorageSize()` | Get storage size |

## Data Structures

### Conversation Object
```javascript
{
  id: 123456789,              // Unique ID
  title: 'My Conversation',   // Display title
  date: Date,                 // Creation date
  lastUpdated: Date,          // Last modified
  messages: Array,            // Array of messages
  tags: Array,                // Custom tags
  messageCount: Number,       // Total messages
  archived: Boolean,          // Archive status
  merged: Boolean,            // Is merged?
  mergedFrom: Array          // Original IDs
}
```

### Message Object
```javascript
{
  id: 1,                      // Unique ID
  role: 'user',               // 'user', 'assistant', 'system'
  content: 'Hello!',          // Message text
  timestamp: Date,            // When sent
  type: 'text',               // 'text', 'image', 'video', 'audio'
  imageUrl: String,           // For images
  videoUrl: String,           // For videos
  audioUrl: String,           // For audio
  metadata: Object            // Additional data
}
```

## JSON Export Format
```json
{
  "version": "1.0",
  "exportDate": "2024-12-05T10:30:00.000Z",
  "conversation": {
    "id": 123456789,
    "title": "My Conversation",
    "messages": [...],
    "tags": ["work", "important"]
  }
}
```

## Best Practices

1. **Regular Exports** - Export conversations monthly for backup
2. **Use Tags** - Organize with consistent tag naming
3. **Archive Old Chats** - Keep sidebar clean
4. **Merge Related Topics** - Create knowledge bases
5. **Search Often** - Find old conversations quickly

## Storage

- localStorage limit: ~5-10 MB per domain
- Export and archive if you hit limits
- Use `getStorageSize()` to monitor usage

## Summary

✅ Auto-save - Never lose conversations
✅ Persistence - Survives browser restarts
✅ Merge - Combine related conversations
✅ Import/Export - Backup and share
✅ Search - Find anything quickly
✅ Tags - Organize your way
✅ Analytics - Track your usage
✅ 100% Local - No server required
✅ Privacy-First - Your data stays with you

Start chatting and let the system manage everything! 🚀
