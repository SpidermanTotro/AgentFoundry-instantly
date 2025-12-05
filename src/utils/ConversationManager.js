/**
 * ConversationManager - Complete conversation management system
 * Features: Persistence, Merging, Search, Import/Export, Analytics
 */

class ConversationManager {
  constructor() {
    this.storageKey = 'chatgpt2_conversations';
    this.currentConvKey = 'chatgpt2_current_conversation';
    this.settingsKey = 'chatgpt2_settings';
  }

  // Save all conversations
  saveConversations(conversations) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(conversations));
      return { success: true };
    } catch (error) {
      console.error('Error saving conversations:', error);
      return { success: false, error: error.message };
    }
  }

  // Load all conversations
  loadConversations() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const conversations = JSON.parse(data);
      return conversations.map(conv => ({
        ...conv,
        date: new Date(conv.date),
        lastUpdated: conv.lastUpdated ? new Date(conv.lastUpdated) : new Date(conv.date),
        messages: conv.messages?.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })) || []
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  // Save single conversation
  saveConversation(conversation) {
    const conversations = this.loadConversations();
    const index = conversations.findIndex(c => c.id === conversation.id);
    
    const updatedConv = {
      ...conversation,
      lastUpdated: new Date(),
      messageCount: conversation.messages?.length || 0
    };

    if (index >= 0) {
      conversations[index] = updatedConv;
    } else {
      conversations.unshift(updatedConv);
    }

    return this.saveConversations(conversations);
  }

  // Get conversation by ID
  getConversation(id) {
    const conversations = this.loadConversations();
    return conversations.find(c => c.id === id);
  }

  // Delete conversation
  deleteConversation(id) {
    const conversations = this.loadConversations();
    const filtered = conversations.filter(c => c.id !== id);
    return this.saveConversations(filtered);
  }

  // Merge conversations
  mergeConversations(conversationIds, newTitle = 'Merged Conversation') {
    const conversations = this.loadConversations();
    const toMerge = conversations.filter(c => conversationIds.includes(c.id));
    
    if (toMerge.length < 2) {
      return { success: false, error: 'Need at least 2 conversations' };
    }

    toMerge.sort((a, b) => new Date(a.date) - new Date(b.date));

    const allMessages = [];
    toMerge.forEach((conv, index) => {
      if (index > 0) {
        allMessages.push({
          id: Date.now() + index,
          role: 'system',
          content: `--- Merged from: ${conv.title} ---`,
          timestamp: new Date(),
          type: 'separator'
        });
      }
      
      if (conv.messages) {
        allMessages.push(...conv.messages);
      }
    });

    const merged = {
      id: Date.now(),
      title: newTitle,
      date: new Date(),
      lastUpdated: new Date(),
      messages: allMessages,
      tags: [...new Set(toMerge.flatMap(c => c.tags || []))],
      merged: true,
      mergedFrom: conversationIds,
      messageCount: allMessages.length
    };

    const result = this.saveConversation(merged);
    
    if (result.success) {
      return { success: true, conversation: merged };
    }
    return result;
  }

  // Search conversations
  searchConversations(query) {
    const conversations = this.loadConversations();
    const lowerQuery = query.toLowerCase();

    return conversations.filter(conv => {
      if (conv.title?.toLowerCase().includes(lowerQuery)) return true;
      if (conv.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
      if (conv.messages?.some(msg => 
        msg.content?.toLowerCase().includes(lowerQuery)
      )) return true;
      return false;
    });
  }

  // Export conversation
  exportConversation(id) {
    const conversation = this.getConversation(id);
    if (!conversation) {
      return { success: false, error: 'Conversation not found' };
    }

    const exported = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      conversation: conversation
    };

    return {
      success: true,
      data: JSON.stringify(exported, null, 2),
      filename: `conversation_${id}_${Date.now()}.json`
    };
  }

  // Export all conversations
  exportAllConversations() {
    const conversations = this.loadConversations();
    
    const exported = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      count: conversations.length,
      conversations: conversations
    };

    return {
      success: true,
      data: JSON.stringify(exported, null, 2),
      filename: `all_conversations_${Date.now()}.json`
    };
  }

  // Import conversations
  importConversation(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      
      if (!imported.conversation && !imported.conversations) {
        return { success: false, error: 'Invalid format' };
      }

      const toImport = imported.conversation 
        ? [imported.conversation] 
        : imported.conversations;

      const conversations = this.loadConversations();
      let imported_count = 0;

      toImport.forEach(conv => {
        const newConv = {
          ...conv,
          id: Date.now() + imported_count,
          date: new Date(conv.date),
          lastUpdated: new Date(),
          imported: true,
          importDate: new Date()
        };
        
        conversations.unshift(newConv);
        imported_count++;
      });

      this.saveConversations(conversations);

      return {
        success: true,
        count: imported_count,
        message: `Imported ${imported_count} conversation(s)`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get statistics
  getStatistics() {
    const conversations = this.loadConversations();
    
    const stats = {
      total: conversations.length,
      totalMessages: 0,
      avgMessagesPerConv: 0
    };

    conversations.forEach(conv => {
      const msgCount = conv.messageCount || conv.messages?.length || 0;
      stats.totalMessages += msgCount;
    });

    if (conversations.length > 0) {
      stats.avgMessagesPerConv = Math.round(stats.totalMessages / conversations.length);
    }

    return stats;
  }

  // Update title
  updateTitle(conversationId, newTitle) {
    const conversation = this.getConversation(conversationId);
    if (!conversation) return { success: false, error: 'Not found' };

    conversation.title = newTitle;
    return this.saveConversation(conversation);
  }

  // Clear all
  clearAllConversations() {
    try {
      localStorage.removeItem(this.storageKey);
      return { success: true, message: 'All conversations cleared' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

const conversationManager = new ConversationManager();
export default conversationManager;
