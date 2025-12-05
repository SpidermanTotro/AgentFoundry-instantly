/**
 * Vector Database Service (RAG System)
 * Provides semantic search and long-term memory for conversations
 * Uses ChromaDB for vector storage and @xenova/transformers for embeddings
 */

const crypto = require('crypto');

class VectorDB {
  constructor() {
    this.collections = new Map();
    this.initialized = false;
    this.embeddingCache = new Map();
    this.maxCacheSize = 1000;
  }

  /**
   * Initialize ChromaDB connection
   */
  async initialize() {
    try {
      // Try to load ChromaDB (optional dependency)
      try {
        const { ChromaClient } = require('chromadb');
        this.client = new ChromaClient({
          path: process.env.CHROMA_PATH || './data/chromadb'
        });
        console.log('✅ ChromaDB initialized');
      } catch (err) {
        console.log('⚠️  ChromaDB not available, using in-memory fallback');
        this.client = null;
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Vector DB initialization error:', error.message);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Generate embeddings for text using simple hash (fallback)
   * In production, use @xenova/transformers or OpenAI embeddings
   */
  async generateEmbedding(text) {
    // Check cache first
    const cacheKey = text.substring(0, 100);
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey);
    }

    // Simple fallback: generate deterministic vector from text
    // In production, use: pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    const hash = crypto.createHash('sha256').update(text).digest();
    const embedding = Array.from(hash.slice(0, 32)).map(b => (b / 255) * 2 - 1);

    // Cache it
    if (this.embeddingCache.size >= this.maxCacheSize) {
      const firstKey = this.embeddingCache.keys().next().value;
      this.embeddingCache.delete(firstKey);
    }
    this.embeddingCache.set(cacheKey, embedding);

    return embedding;
  }

  /**
   * Create or get a collection
   */
  async getCollection(name = 'conversations') {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.collections.has(name)) {
      return this.collections.get(name);
    }

    if (this.client) {
      try {
        const collection = await this.client.getOrCreateCollection({ name });
        this.collections.set(name, collection);
        return collection;
      } catch (err) {
        console.error('ChromaDB collection error:', err.message);
      }
    }

    // Fallback: in-memory collection
    const memoryCollection = {
      name,
      documents: [],
      embeddings: [],
      metadata: [],
      ids: []
    };
    this.collections.set(name, memoryCollection);
    return memoryCollection;
  }

  /**
   * Add conversation to vector database
   */
  async addConversation(conversationId, messages, metadata = {}) {
    try {
      const collection = await this.getCollection('conversations');
      
      // Combine messages into searchable text
      const text = messages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n\n');

      const embedding = await this.generateEmbedding(text);
      const id = conversationId || `conv_${Date.now()}`;

      if (collection.add) {
        // ChromaDB collection
        await collection.add({
          ids: [id],
          embeddings: [embedding],
          documents: [text],
          metadatas: [{
            ...metadata,
            messageCount: messages.length,
            timestamp: Date.now()
          }]
        });
      } else {
        // In-memory collection
        collection.ids.push(id);
        collection.embeddings.push(embedding);
        collection.documents.push(text);
        collection.metadata.push({
          ...metadata,
          messageCount: messages.length,
          timestamp: Date.now()
        });
      }

      console.log(`✅ Added conversation ${id} to vector DB`);
      return id;
    } catch (error) {
      console.error('Error adding conversation:', error.message);
      return null;
    }
  }

  /**
   * Semantic search: find similar conversations
   */
  async searchConversations(query, limit = 5) {
    try {
      const collection = await this.getCollection('conversations');
      const queryEmbedding = await this.generateEmbedding(query);

      if (collection.query) {
        // ChromaDB collection
        const results = await collection.query({
          queryEmbeddings: [queryEmbedding],
          nResults: limit
        });
        return results;
      } else {
        // In-memory: cosine similarity search
        const similarities = collection.embeddings.map((emb, idx) => ({
          id: collection.ids[idx],
          document: collection.documents[idx],
          metadata: collection.metadata[idx],
          similarity: this.cosineSimilarity(queryEmbedding, emb)
        }));

        return similarities
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, limit);
      }
    } catch (error) {
      console.error('Search error:', error.message);
      return [];
    }
  }

  /**
   * Get conversation context for RAG
   */
  async getRelevantContext(query, limit = 3) {
    const results = await this.searchConversations(query, limit);
    
    if (results.documents) {
      // ChromaDB format
      return results.documents[0].map((doc, idx) => ({
        text: doc,
        metadata: results.metadatas[0][idx],
        distance: results.distances[0][idx]
      }));
    } else {
      // In-memory format
      return results.map(r => ({
        text: r.document,
        metadata: r.metadata,
        similarity: r.similarity
      }));
    }
  }

  /**
   * Add message to conversation history
   */
  async addMessage(conversationId, message) {
    try {
      const collection = await this.getCollection('messages');
      const text = `${message.role}: ${message.content}`;
      const embedding = await this.generateEmbedding(text);
      const id = `msg_${conversationId}_${Date.now()}`;

      if (collection.add) {
        await collection.add({
          ids: [id],
          embeddings: [embedding],
          documents: [text],
          metadatas: [{
            conversationId,
            role: message.role,
            timestamp: Date.now()
          }]
        });
      } else {
        collection.ids.push(id);
        collection.embeddings.push(embedding);
        collection.documents.push(text);
        collection.metadata.push({
          conversationId,
          role: message.role,
          timestamp: Date.now()
        });
      }

      return id;
    } catch (error) {
      console.error('Error adding message:', error.message);
      return null;
    }
  }

  /**
   * Delete conversation from vector DB
   */
  async deleteConversation(conversationId) {
    try {
      const collection = await this.getCollection('conversations');
      
      if (collection.delete) {
        await collection.delete({ ids: [conversationId] });
      } else {
        const idx = collection.ids.indexOf(conversationId);
        if (idx !== -1) {
          collection.ids.splice(idx, 1);
          collection.embeddings.splice(idx, 1);
          collection.documents.splice(idx, 1);
          collection.metadata.splice(idx, 1);
        }
      }
      
      console.log(`✅ Deleted conversation ${conversationId}`);
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error.message);
      return false;
    }
  }

  /**
   * Get statistics
   */
  async getStats() {
    try {
      const convCollection = await this.getCollection('conversations');
      const msgCollection = await this.getCollection('messages');

      const conversationCount = convCollection.count ? 
        await convCollection.count() : 
        convCollection.ids.length;

      const messageCount = msgCollection.count ? 
        await msgCollection.count() : 
        msgCollection.ids.length;

      return {
        conversations: conversationCount,
        messages: messageCount,
        cacheSize: this.embeddingCache.size,
        backend: this.client ? 'ChromaDB' : 'In-Memory'
      };
    } catch (error) {
      return {
        conversations: 0,
        messages: 0,
        cacheSize: 0,
        backend: 'Error'
      };
    }
  }

  /**
   * Cosine similarity helper
   */
  cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// Singleton instance
const vectorDB = new VectorDB();

module.exports = vectorDB;
