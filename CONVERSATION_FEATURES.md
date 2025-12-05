# 🗂️ Complete Conversation Management System

## Overview

ChatGPT 2.0 includes a **complete conversation management system** with persistence, merging, search, import/export, analytics, and more. All conversations are automatically saved to your browser's localStorage.

---

## 🎯 Key Features

### 1. **Auto-Save & Persistence**
- ✅ All conversations automatically saved to localStorage
- ✅ Messages saved in real-time as you chat
- ✅ Survives browser refresh and restarts
- ✅ No server required - 100% local storage

### 2. **Conversation Management**
- ✅ Create unlimited conversations
- ✅ Switch between conversations instantly
- ✅ Rename conversations with custom titles
- ✅ Delete conversations you don't need
- ✅ Archive old conversations
- ✅ Search across all conversations

### 3. **Merge Conversations**
- ✅ Merge 2+ conversations into one
- ✅ Automatic chronological ordering
- ✅ Preserves all messages and metadata
- ✅ Adds separator markers between merged conversations
- ✅ Combines tags from all conversations

### 4. **Import/Export**
- ✅ Export single conversation to JSON
- ✅ Export all conversations at once
- ✅ Import conversations from JSON files
- ✅ Share conversations with others
- ✅ Backup your data

### 5. **Search & Filter**
- ✅ Search by conversation title
- ✅ Search by message content
- ✅ Search by tags
- ✅ Filter by date range
- ✅ Filter by archived status
- ✅ Filter by message count

### 6. **Tags & Organization**
- ✅ Add custom tags to conversations
- ✅ Filter conversations by tags
- ✅ View all tags across conversations
- ✅ Tag-based categorization

### 7. **Analytics & Statistics**
- ✅ Total conversation count
- ✅ Total message count
- ✅ Average messages per conversation
- ✅ Most active conversation
- ✅ Oldest and newest conversations
- ✅ Tag usage statistics
- ✅ Storage size tracking

---

## 🚀 How to Use

### Creating a New Conversation

1. Click **"+ New Chat"** button in sidebar
2. Start chatting immediately
3. Conversation auto-saves as you type
4. Title auto-generated from first message

### Switching Conversations

1. Click any conversation in the sidebar
2. Messages load instantly
3. Continue where you left off

### Renaming a Conversation

```javascript
// In conversation item, click edit icon
// Or use the API:
conversationManager.updateTitle(conversationId, 'New Title');
```

### Deleting a Conversation

1. Right-click conversation in sidebar
2. Click **"Delete"**
3. Confirm deletion
4. Conversation permanently removed

### Archiving Conversations

```javascript
// Archive a conversation
conversationManager.archiveConversation(conversationId);

// Unarchive
conversationManager.unarchiveConversation(conversationId);

// Filter to show/hide archived
const activeConvs = conversations.filter(c => !c.archived);
```

---

## 🔄 Merging Conversations

### Why Merge?

- Combine related conversations
- Consolidate research topics
- Merge conversations from different time periods
- Create comprehensive conversation history

### How to Merge

1. **Select Conversations**
   - Check boxes next to 2+ conversations
   - Click **"Merge Selected"** button

2. **Enter Merged Title**
   - Default: "Merged Conversation"
   - Custom: Your own title

3. **Review Merged Result**
   - All messages combined chronologically
   - Separator markers show original conversation titles
   - All tags combined

### Merge Example

```javascript
// Select conversation IDs
const ids = [123, 456, 789];

// Merge them
const result = conversationManager.mergeConversations(
  ids,
  'All My Research on AI'
);

if (result.success) {
  console.log('Merged conversation:', result.conversation);
  // Load the merged conversation
  setCurrentConversationId(result.conversation.id);
  setMessages(result.conversation.messages);
}
```

### Merged Conversation Format

```
User: First message
AI: Response...

--- Merged from: Conversation 2 (12/5/2024, 10:30 AM) ---

User: Message from conversation 2
AI: Response from conversation 2...

--- Merged from: Conversation 3 (12/5/2024, 11:45 AM) ---

User: Message from conversation 3
AI: Response...
```

---

## 🔍 Search & Filter

### Search by Keyword

```javascript
// Search all conversations
const results = conversationManager.searchConversations('AI research');

// Results include matches in:
// - Conversation titles
// - Message content
// - Tags
```

### Filter by Criteria

```javascript
// Filter conversations
const filtered = conversationManager.filterConversations({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  tags: ['work', 'research'],
  archived: false,
  minMessages: 10
});
```

### Sort Conversations

```javascript
// Sort by different criteria
const sorted = conversationManager.sortConversations(
  conversations,
  'lastUpdated',  // or 'date', 'title', 'messages'
  'desc'          // or 'asc'
);
```

---

## 📤 Import/Export

### Export Single Conversation

```javascript
// Export one conversation
const result = conversationManager.exportConversation(conversationId);

if (result.success) {
  // Download the JSON file
  const blob = new Blob([result.data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.filename;
  a.click();
}
```

### Export All Conversations

```javascript
// Export everything
const result = conversationManager.exportAllConversations();

// Same download process as single export
const blob = new Blob([result.data], { type: 'application/json' });
// ... download code
```

### Import Conversations

```javascript
// Import from JSON file
const fileInput = document.getElementById('import-file');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const text = await file.text();
  
  const result = conversationManager.importConversation(text);
  
  if (result.success) {
    console.log(`Imported ${result.count} conversation(s)`);
    // Reload conversations
    const updated = conversationManager.loadConversations();
    setConversations(updated);
  }
});
```

### JSON Format

```json
{
  "version": "1.0",
  "exportDate": "2024-12-05T10:30:00.000Z",
  "conversation": {
    "id": 123456789,
    "title": "My Conversation",
    "date": "2024-12-05T10:00:00.000Z",
    "lastUpdated": "2024-12-05T10:30:00.000Z",
    "messages": [
      {
        "id": 1,
        "role": "user",
        "content": "Hello!",
        "timestamp": "2024-12-05T10:00:00.000Z",
        "type": "text"
      },
      {
        "id": 2,
        "role": "assistant",
        "content": "Hi! How can I help?",
        "timestamp": "2024-12-05T10:00:05.000Z",
        "type": "text"
      }
    ],
    "tags": ["test", "demo"],
    "messageCount": 2
  }
}
```

---

## 🏷️ Tags System

### Adding Tags

```javascript
// Add tag to conversation
conversationManager.addTag(conversationId, 'work');
conversationManager.addTag(conversationId, 'important');
```

### Removing Tags

```javascript
// Remove tag
conversationManager.removeTag(conversationId, 'work');
```

### Getting All Tags

```javascript
// Get list of all tags used
const allTags = conversationManager.getAllTags();
// Returns: ['work', 'personal', 'research', 'important']
```

### Filtering by Tags

```javascript
// Get conversations with specific tags
const workConvs = conversations.filter(c => 
  c.tags?.includes('work')
);
```

---

## 📊 Analytics & Statistics

### Get Global Statistics

```javascript
const stats = conversationManager.getStatistics();

console.log(stats);
/*
{
  total: 25,
  archived: 3,
  active: 22,
  totalMessages: 450,
  avgMessagesPerConv: 18,
  oldestConversation: { ... },
  newestConversation: { ... },
  mostActive: { ... },
  tagCount: 8,
  tags: {
    'work': 12,
    'personal': 8,
    'research': 5
  }
}
*/
```

### Statistics Breakdown

- **total**: Total number of conversations
- **archived**: Number of archived conversations
- **active**: Number of active conversations
- **totalMessages**: Total messages across all conversations
- **avgMessagesPerConv**: Average messages per conversation
- **oldestConversation**: Oldest conversation by date
- **newestConversation**: Most recent conversation
- **mostActive**: Conversation with most messages
- **tagCount**: Total number of unique tags
- **tags**: Tag usage count

---

## 💾 Storage Management

### Check Storage Size

```javascript
const size = conversationManager.getStorageSize();

console.log(size);
/*
{
  bytes: 524288,
  kb: '512.00',
  mb: '0.50',
  formatted: '512.00 KB'
}
*/
```

### Clear All Conversations

```javascript
// ⚠️ WARNING: This deletes ALL conversations permanently!
const result = conversationManager.clearAllConversations();

if (result.success) {
  console.log('All conversations cleared');
}
```

### Storage Limits

- **localStorage Limit**: ~5-10 MB per domain (browser dependent)
- **Recommended**: Export and archive old conversations if you hit limits
- **Tip**: Use the export feature to back up conversations before clearing

---

## 🎨 UI Components

### Sidebar Conversation List

```jsx
<div className="conversations-list">
  {conversations.map(conv => (
    <div 
      key={conv.id}
      className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
      onClick={() => loadConversation(conv.id)}
    >
      <FaHistory />
      <div className="conversation-info">
        <span className="conversation-title">{conv.title}</span>
        <span className="conversation-date">
          {conv.date.toLocaleDateString()}
        </span>
        <span className="message-count">
          {conv.messageCount || 0} messages
        </span>
      </div>
      {conv.archived && <span className="archived-badge">📁</span>}
      {conv.merged && <span className="merged-badge">🔗</span>}
    </div>
  ))}
</div>
```

### Search Bar

```jsx
<div className="search-bar">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search conversations..."
  />
  <FaSearch />
</div>
```

### Merge Modal

```jsx
{showMergeModal && (
  <div className="merge-modal">
    <h3>Merge Conversations</h3>
    <p>Selected: {selectedConvs.length} conversations</p>
    <input
      type="text"
      placeholder="Enter merged conversation title"
      value={mergeTitle}
      onChange={(e) => setMergeTitle(e.target.value)}
    />
    <button onClick={handleMerge}>Merge</button>
    <button onClick={() => setShowMergeModal(false)}>Cancel</button>
  </div>
)}
```

---

## 🔧 Advanced Features

### Conversation Metadata

Each conversation includes:

```javascript
{
  id: 123456789,              // Unique ID (timestamp)
  title: 'My Conversation',   // Display title
  date: Date,                 // Creation date
  lastUpdated: Date,          // Last modified date
  messages: Array,            // Array of message objects
  tags: Array,                // Custom tags
  messageCount: Number,       // Total message count
  archived: Boolean,          // Archive status
  archivedAt: Date,           // Archive timestamp
  merged: Boolean,            // Is merged conversation?
  mergedFrom: Array,          // Original conversation IDs
  imported: Boolean,          // Was imported?
  importDate: Date            // Import timestamp
}
```

### Message Metadata

Each message includes:

```javascript
{
  id: 1,                      // Unique message ID
  role: 'user',               // 'user', 'assistant', or 'system'
  content: 'Hello!',          // Message text
  timestamp: Date,            // When message was sent
  type: 'text',               // 'text', 'image', 'video', 'audio', 'file'
  imageUrl: String,           // For image messages
  videoUrl: String,           // For video messages
  audioUrl: String,           // For audio messages
  file: Object,               // For file messages
  metadata: Object            // Additional metadata
}
```

---

## 🚨 Error Handling

All conversation manager methods return a result object:

```javascript
// Success
{
  success: true,
  data: { ... },
  message: 'Operation successful'
}

// Error
{
  success: false,
  error: 'Error message here'
}
```

### Example Error Handling

```javascript
const result = conversationManager.deleteConversation(id);

if (result.success) {
  console.log('Conversation deleted');
  // Update UI
} else {
  console.error('Failed to delete:', result.error);
  alert(`Error: ${result.error}`);
}
```

---

## 📱 Mobile Support

All conversation management features work on mobile:

- Touch-friendly conversation list
- Swipe gestures for actions
- Mobile-optimized modals
- Responsive search and filters

---

## 🎯 Best Practices

### 1. **Regular Exports**
- Export conversations monthly
- Keep backups in safe location
- Use descriptive export filenames

### 2. **Use Tags Wisely**
- Create consistent tag naming
- Use tags for categorization
- Don't over-tag (3-5 tags per conversation)

### 3. **Archive Old Conversations**
- Archive conversations you don't need often
- Keeps sidebar clean and fast
- Easy to unarchive when needed

### 4. **Merge Related Topics**
- Merge conversations on same topic
- Create comprehensive knowledge bases
- Easier to search and reference

### 5. **Search Often**
- Use search to find old conversations
- Search by keywords, not exact phrases
- Search works across all messages

---

## 🔗 API Reference

### ConversationManager Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `loadConversations()` | none | Array | Load all conversations |
| `saveConversation(conv)` | conversation | Result | Save/update conversation |
| `getConversation(id)` | id | Conversation | Get single conversation |
| `deleteConversation(id)` | id | Result | Delete conversation |
| `archiveConversation(id)` | id | Result | Archive conversation |
| `mergeConversations(ids, title)` | ids[], title | Result | Merge conversations |
| `searchConversations(query)` | query | Array | Search conversations |
| `sortConversations(convs, by, order)` | convs[], sortBy, order | Array | Sort conversations |
| `exportConversation(id)` | id | Result | Export to JSON |
| `exportAllConversations()` | none | Result | Export all to JSON |
| `importConversation(json)` | jsonString | Result | Import from JSON |
| `addTag(id, tag)` | id, tag | Result | Add tag to conversation |
| `getAllTags()` | none | Array | Get all tags |
| `getStatistics()` | none | Object | Get statistics |
| `updateTitle(id, title)` | id, title | Result | Update conversation title |
| `clearAllConversations()` | none | Result | Clear all conversations |
| `getStorageSize()` | none | Object | Get storage size |

---

## 🎉 Summary

The conversation management system provides:

✅ **Auto-save** - Never lose your conversations
✅ **Persistence** - Survives browser restarts
✅ **Merge** - Combine related conversations
✅ **Import/Export** - Backup and share
✅ **Search** - Find anything quickly
✅ **Tags** - Organize your way
✅ **Analytics** - Track your usage
✅ **100% Local** - No server required
✅ **Privacy-First** - Your data stays with you

**Start chatting and let the system manage everything for you!** 🚀

---

**Need Help?** Check the [ChatGPT UI Guide](./CHATGPT_UI.md) for more information.
