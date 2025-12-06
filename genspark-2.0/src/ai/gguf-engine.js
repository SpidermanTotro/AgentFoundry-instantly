/**
 * GenSpark 2.0 - GGUF Model Engine
 * Offline AI using llama.cpp and GGUF models
 * NO INTERNET REQUIRED
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class GGUFEngine {
    constructor() {
        this.modelsPath = path.join(__dirname, '../../models');
        this.llamaCppPath = path.join(__dirname, '../../bin/llama.cpp');
        
        // Popular GGUF models to download
        this.availableModels = {
            'llama2-7b': 'llama-2-7b-chat.Q4_K_M.gguf',
            'mistral-7b': 'mistral-7b-instruct-v0.2.Q4_K_M.gguf',
            'codellama-7b': 'codellama-7b-instruct.Q4_K_M.gguf',
            'phi-2': 'phi-2.Q4_K_M.gguf',
            'tinyllama': 'tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf'
        };
        
        this.currentModel = null;
    }
    
    async initialize(modelName = 'llama2-7b') {
        console.log(`🔧 Initializing GGUF engine with ${modelName}...`);
        
        // Check if model exists
        const modelPath = path.join(this.modelsPath, this.availableModels[modelName]);
        
        if (!fs.existsSync(modelPath)) {
            console.log(`📥 Model not found. Download instructions:`);
            console.log(`   wget https://huggingface.co/TheBloke/${modelName}-GGUF/resolve/main/${this.availableModels[modelName]}`);
            console.log(`   mv ${this.availableModels[modelName]} ${this.modelsPath}/`);
            return false;
        }
        
        this.currentModel = modelPath;
        console.log(`✅ Model loaded: ${modelPath}`);
        return true;
    }
    
    async generate(prompt, options = {}) {
        if (!this.currentModel) {
            throw new Error('Model not initialized. Call initialize() first.');
        }
        
        const defaults = {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 0.9,
            topK: 40,
            repeatPenalty: 1.1,
            threads: 4,
            ...options
        };
        
        // Build llama.cpp command
        const cmd = [
            this.llamaCppPath,
            '-m', this.currentModel,
            '-p', `"${prompt}"`,
            '-n', defaults.maxTokens,
            '-t', defaults.threads,
            '--temp', defaults.temperature,
            '--top-p', defaults.topP,
            '--top-k', defaults.topK,
            '--repeat-penalty', defaults.repeatPenalty
        ].join(' ');
        
        return new Promise((resolve, reject) => {
            exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                resolve({
                    text: stdout.trim(),
                    model: path.basename(this.currentModel),
                    tokens: this._estimateTokens(stdout),
                    offline: true
                });
            });
        });
    }
    
    async complete(code, language = 'python') {
        const prompt = `Complete this ${language} code:\n\n${code}\n\nCompletion:`;
        return await this.generate(prompt, {
            temperature: 0.2,
            maxTokens: 512
        });
    }
    
    async chat(message, context = []) {
        let prompt = '';
        
        // Add context
        if (context.length > 0) {
            prompt += context.map(msg => 
                `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
            ).join('\n') + '\n';
        }
        
        prompt += `User: ${message}\nAssistant:`;
        
        return await this.generate(prompt, {
            temperature: 0.7,
            maxTokens: 1024
        });
    }
    
    async explain(code, language = 'python') {
        const prompt = `Explain this ${language} code:\n\n${code}\n\nExplanation:`;
        return await this.generate(prompt, {
            temperature: 0.3,
            maxTokens: 1024
        });
    }
    
    async fixBugs(code, language = 'python') {
        const prompt = `Find and fix bugs in this ${language} code:\n\n${code}\n\nFixed code:`;
        return await this.generate(prompt, {
            temperature: 0.1,
            maxTokens: 1024
        });
    }
    
    _estimateTokens(text) {
        // Rough estimation: ~4 chars per token
        return Math.ceil(text.length / 4);
    }
    
    getModelInfo() {
        if (!this.currentModel) {
            return null;
        }
        
        const stats = fs.statSync(this.currentModel);
        return {
            name: path.basename(this.currentModel),
            path: this.currentModel,
            size: `${(stats.size / (1024 * 1024 * 1024)).toFixed(2)} GB`,
            offline: true,
            quantization: 'Q4_K_M',
            type: 'GGUF'
        };
    }
    
    listAvailableModels() {
        const available = [];
        
        for (const [name, filename] of Object.entries(this.availableModels)) {
            const modelPath = path.join(this.modelsPath, filename);
            const exists = fs.existsSync(modelPath);
            
            available.push({
                name,
                filename,
                exists,
                downloadUrl: `https://huggingface.co/TheBloke/${name}-GGUF/resolve/main/${filename}`
            });
        }
        
        return available;
    }
}

module.exports = { GGUFEngine };
