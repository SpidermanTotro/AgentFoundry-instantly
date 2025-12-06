/**
 * GenSpark AI Developer - GGUF AI Engine
 * 100% Offline AI with Live Streaming Responses
 * Supports: CodeLlama, DeepSeek Coder, Llama 3, Mistral
 */

import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import path from 'path';

class GGUFEngine extends EventEmitter {
    constructor() {
        super();
        this.model = null;
        this.context = null;
        this.session = null;
        this.isLoaded = false;
        this.currentModel = null;
        
        // Available models
        this.availableModels = {
            'codellama-13b': {
                name: 'CodeLlama 13B',
                file: 'codellama-13b-instruct.Q4_K_M.gguf',
                url: 'https://huggingface.co/TheBloke/CodeLlama-13B-Instruct-GGUF/resolve/main/codellama-13b-instruct.Q4_K_M.gguf',
                size: '7.6GB',
                description: 'Best for code generation, debugging, refactoring'
            },
            'deepseek-coder-33b': {
                name: 'DeepSeek Coder 33B',
                file: 'deepseek-coder-33b-instruct.Q4_K_M.gguf',
                url: 'https://huggingface.co/TheBloke/deepseek-coder-33b-instruct-GGUF/resolve/main/deepseek-coder-33b-instruct.Q4_K_M.gguf',
                size: '19GB',
                description: 'Elite coding AI - beats GPT-4 on coding tasks'
            },
            'llama3-8b': {
                name: 'Llama 3 8B Instruct',
                file: 'Meta-Llama-3-8B-Instruct.Q4_K_M.gguf',
                url: 'https://huggingface.co/QuantFactory/Meta-Llama-3-8B-Instruct-GGUF/resolve/main/Meta-Llama-3-8B-Instruct.Q4_K_M.gguf',
                size: '4.9GB',
                description: 'Fast general-purpose AI with strong reasoning'
            },
            'mistral-7b': {
                name: 'Mistral 7B Instruct',
                file: 'mistral-7b-instruct-v0.2.Q4_K_M.gguf',
                url: 'https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf',
                size: '4.4GB',
                description: 'Excellent balance of speed and quality'
            },
            'tinyllama': {
                name: 'TinyLlama 1.1B',
                file: 'tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
                url: 'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
                size: '670MB',
                description: 'Ultra-fast for quick tasks'
            }
        };
    }

    /**
     * Load a GGUF model
     */
    async loadModel(modelKey = 'codellama-13b') {
        try {
            const modelInfo = this.availableModels[modelKey];
            if (!modelInfo) {
                throw new Error(`Model ${modelKey} not found`);
            }

            const modelPath = path.join(process.cwd(), 'models', modelInfo.file);
            
            // Check if model exists
            if (!await fs.pathExists(modelPath)) {
                throw new Error(`Model file not found: ${modelPath}. Download from: ${modelInfo.url}`);
            }

            this.emit('loading', { model: modelInfo.name, status: 'loading' });
            
            // Load model
            this.model = new LlamaModel({
                modelPath: modelPath,
                gpuLayers: 0 // CPU only - set to higher for GPU
            });

            // Create context
            this.context = new LlamaContext({
                model: this.model,
                contextSize: 4096 // 4K context window
            });

            // Create chat session
            this.session = new LlamaChatSession({
                context: this.context
            });

            this.isLoaded = true;
            this.currentModel = modelKey;
            
            this.emit('loaded', { 
                model: modelInfo.name, 
                status: 'ready',
                context: 4096
            });

            return {
                success: true,
                model: modelInfo.name,
                context: 4096
            };

        } catch (error) {
            this.emit('error', { error: error.message });
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate code with LIVE STREAMING
     */
    async *generateStream(prompt, options = {}) {
        if (!this.isLoaded) {
            yield { error: 'Model not loaded' };
            return;
        }

        const {
            temperature = 0.7,
            maxTokens = 2048,
            stopSequences = ['</code>', '\n\n\n']
        } = options;

        try {
            this.emit('generating', { prompt: prompt.substring(0, 100) });

            // Stream tokens one by one
            const response = this.session.prompt(prompt, {
                temperature,
                maxTokens,
                stopSequences,
                onToken: (token) => {
                    // This gets called for EVERY token generated
                    return true; // Continue generating
                }
            });

            // Yield tokens as they come
            let fullResponse = '';
            for await (const token of response) {
                fullResponse += token;
                yield {
                    token: token,
                    full: fullResponse,
                    done: false
                };
            }

            yield {
                token: '',
                full: fullResponse,
                done: true
            };

            this.emit('generated', { length: fullResponse.length });

        } catch (error) {
            yield {
                error: error.message,
                done: true
            };
        }
    }

    /**
     * Chat with the AI (with context memory)
     */
    async chat(message, stream = true) {
        if (!this.isLoaded) {
            return { error: 'Model not loaded' };
        }

        try {
            if (stream) {
                // Return async generator for streaming
                return this.generateStream(message);
            } else {
                // Return complete response
                const response = await this.session.prompt(message);
                return {
                    success: true,
                    response: response,
                    model: this.currentModel
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Code completion with context
     */
    async completeCode(code, cursorPosition, language = 'javascript') {
        const prompt = `You are an expert ${language} developer. Complete this code:

\`\`\`${language}
${code}
\`\`\`

Cursor position: ${cursorPosition}

Complete the code naturally. Return ONLY the completion, no explanations.`;

        return this.chat(prompt, true);
    }

    /**
     * Fix bugs in code
     */
    async fixBugs(code, error, language = 'javascript') {
        const prompt = `You are an expert ${language} debugger.

CODE:
\`\`\`${language}
${code}
\`\`\`

ERROR:
${error}

Fix the bug and return the corrected code. Explain what was wrong.`;

        return this.chat(prompt, true);
    }

    /**
     * Refactor code
     */
    async refactorCode(code, instructions, language = 'javascript') {
        const prompt = `You are an expert ${language} developer.

CURRENT CODE:
\`\`\`${language}
${code}
\`\`\`

REFACTORING INSTRUCTIONS:
${instructions}

Refactor the code according to the instructions. Return the improved code.`;

        return this.chat(prompt, true);
    }

    /**
     * Generate tests
     */
    async generateTests(code, language = 'javascript', framework = 'jest') {
        const prompt = `You are an expert ${language} developer.

CODE TO TEST:
\`\`\`${language}
${code}
\`\`\`

Generate comprehensive ${framework} tests for this code. Include:
- Unit tests
- Edge cases
- Error handling
- 100% coverage`;

        return this.chat(prompt, true);
    }

    /**
     * Get model info
     */
    getModelInfo() {
        return {
            loaded: this.isLoaded,
            current: this.currentModel,
            available: Object.keys(this.availableModels).map(key => ({
                key,
                ...this.availableModels[key]
            }))
        };
    }

    /**
     * Reset chat session (clear context)
     */
    resetSession() {
        if (this.context) {
            this.session = new LlamaChatSession({
                context: this.context
            });
            return { success: true, message: 'Session reset' };
        }
        return { success: false, error: 'No active session' };
    }
}

export default GGUFEngine;
