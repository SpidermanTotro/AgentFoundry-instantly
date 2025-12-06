/**
 * GenSpark AI Developer - Advanced Developer Mimicry
 * Thinks and acts like a senior developer
 * Plans, researches, writes tests, explains decisions
 */

import { EventEmitter } from 'events';

class DeveloperAI extends EventEmitter {
    constructor(aiEngine, fileManager) {
        super();
        this.aiEngine = aiEngine;
        this.fileManager = fileManager;
        this.currentTask = null;
        this.taskHistory = [];
    }

    /**
     * Build a complete project from description
     * MIMICS: Planning, Architecture Design, Implementation
     */
    async buildProject(description, options = {}) {
        const {
            name = 'generated-project',
            language = 'javascript',
            includeTests = true,
            includeDocs = true
        } = options;

        try {
            // Phase 1: Planning
            this.emit('phase', { phase: 'planning', status: 'started' });
            const plan = await this.planProject(description, language);
            this.emit('phase', { phase: 'planning', status: 'completed', plan });

            // Phase 2: Architecture
            this.emit('phase', { phase: 'architecture', status: 'started' });
            const architecture = await this.designArchitecture(plan);
            this.emit('phase', { phase: 'architecture', status: 'completed', architecture });

            // Phase 3: Implementation
            this.emit('phase', { phase: 'implementation', status: 'started' });
            const files = await this.generateProjectFiles(plan, architecture, language);
            this.emit('phase', { phase: 'implementation', status: 'completed', files: files.length });

            // Phase 4: Testing (if enabled)
            if (includeTests) {
                this.emit('phase', { phase: 'testing', status: 'started' });
                const tests = await this.generateTests(files);
                files.push(...tests);
                this.emit('phase', { phase: 'testing', status: 'completed', tests: tests.length });
            }

            // Phase 5: Documentation (if enabled)
            if (includeDocs) {
                this.emit('phase', { phase: 'documentation', status: 'started' });
                const docs = await this.generateDocumentation(plan, files);
                files.push(...docs);
                this.emit('phase', { phase: 'documentation', status: 'completed' });
            }

            // Phase 6: Create all files
            this.emit('phase', { phase: 'writing', status: 'started' });
            const result = await this.fileManager.createFiles(files, { autoUpload: true });
            this.emit('phase', { phase: 'writing', status: 'completed' });

            return {
                success: true,
                project: name,
                phases: ['planning', 'architecture', 'implementation', 'testing', 'documentation', 'writing'],
                files: result.files,
                statistics: {
                    totalFiles: files.length,
                    totalLines: files.reduce((sum, f) => sum + f.content.split('\n').length, 0),
                    totalSize: files.reduce((sum, f) => sum + f.content.length, 0)
                }
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
     * Plan the project structure
     */
    async planProject(description, language) {
        const prompt = `You are a senior ${language} architect. Plan this project:

PROJECT: ${description}

Create a detailed plan including:
1. Core features
2. File structure
3. Dependencies
4. Architecture patterns
5. Development phases

Return a JSON plan.`;

        let planText = '';
        const stream = await this.aiEngine.chat(prompt, true);
        
        for await (const chunk of stream) {
            if (chunk.token) {
                planText += chunk.token;
                this.emit('thinking', { text: chunk.token, type: 'planning' });
            }
        }

        // Extract JSON from response
        try {
            const jsonMatch = planText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            // If JSON parsing fails, return raw plan
        }

        return {
            description: description,
            language: language,
            plan: planText
        };
    }

    /**
     * Design system architecture
     */
    async designArchitecture(plan) {
        const prompt = `You are a software architect. Design the architecture for:

PLAN: ${JSON.stringify(plan, null, 2)}

Define:
1. Component structure
2. Data flow
3. API endpoints
4. Database schema
5. Module interactions

Return detailed architecture.`;

        let archText = '';
        const stream = await this.aiEngine.chat(prompt, true);
        
        for await (const chunk of stream) {
            if (chunk.token) {
                archText += chunk.token;
                this.emit('thinking', { text: chunk.token, type: 'architecture' });
            }
        }

        return archText;
    }

    /**
     * Generate all project files
     */
    async generateProjectFiles(plan, architecture, language) {
        const files = [];

        // Determine files to generate
        const fileList = this.determineFiles(plan, language);

        for (const fileName of fileList) {
            this.emit('generating', { file: fileName, status: 'started' });

            const prompt = `You are an expert ${language} developer. Generate the file: ${fileName}

PROJECT PLAN:
${JSON.stringify(plan, null, 2)}

ARCHITECTURE:
${architecture}

Generate ONLY the code for ${fileName}. No explanations.`;

            let fileContent = '';
            const stream = await this.aiEngine.chat(prompt, true);
            
            for await (const chunk of stream) {
                if (chunk.token) {
                    fileContent += chunk.token;
                    this.emit('codeStreaming', { 
                        file: fileName, 
                        token: chunk.token 
                    });
                }
            }

            // Clean up code blocks
            fileContent = this.cleanCode(fileContent);

            files.push({
                path: fileName,
                content: fileContent
            });

            this.emit('generating', { file: fileName, status: 'completed', size: fileContent.length });
        }

        return files;
    }

    /**
     * Generate test files
     */
    async generateTests(files) {
        const tests = [];

        for (const file of files) {
            if (file.path.includes('test') || file.path.includes('spec')) {
                continue; // Skip test files
            }

            const testPath = file.path.replace(/\.(js|ts|py)$/, '.test.$1');
            
            const prompt = `Generate comprehensive tests for:

FILE: ${file.path}
CODE:
\`\`\`
${file.content}
\`\`\`

Generate unit tests with 100% coverage. Include edge cases.`;

            let testContent = '';
            const stream = await this.aiEngine.chat(prompt, true);
            
            for await (const chunk of stream) {
                if (chunk.token) {
                    testContent += chunk.token;
                }
            }

            tests.push({
                path: `tests/${testPath}`,
                content: this.cleanCode(testContent)
            });
        }

        return tests;
    }

    /**
     * Generate documentation
     */
    async generateDocumentation(plan, files) {
        const docs = [];

        // README
        const readmePrompt = `Generate a comprehensive README.md for this project:

PLAN: ${JSON.stringify(plan, null, 2)}

FILES: ${files.map(f => f.path).join(', ')}

Include:
- Project description
- Installation steps
- Usage examples
- API documentation
- Contributing guidelines`;

        let readme = '';
        const stream = await this.aiEngine.chat(readmePrompt, true);
        
        for await (const chunk of stream) {
            if (chunk.token) {
                readme += chunk.token;
            }
        }

        docs.push({
            path: 'README.md',
            content: this.cleanCode(readme)
        });

        return docs;
    }

    /**
     * Determine which files to generate
     */
    determineFiles(plan, language) {
        const baseFiles = {
            javascript: [
                'src/index.js',
                'src/config.js',
                'src/utils.js',
                'package.json'
            ],
            python: [
                'src/__init__.py',
                'src/main.py',
                'src/config.py',
                'src/utils.py',
                'requirements.txt'
            ],
            typescript: [
                'src/index.ts',
                'src/config.ts',
                'src/types.ts',
                'src/utils.ts',
                'package.json',
                'tsconfig.json'
            ]
        };

        return baseFiles[language] || baseFiles.javascript;
    }

    /**
     * Clean generated code
     */
    cleanCode(code) {
        // Remove markdown code blocks
        code = code.replace(/```[\w]*\n/g, '');
        code = code.replace(/```$/g, '');
        
        // Remove explanation text before/after code
        const lines = code.split('\n');
        let codeStart = 0;
        let codeEnd = lines.length;

        // Find first line that looks like code
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].match(/^(import|const|let|var|function|class|def |async |export)/)) {
                codeStart = i;
                break;
            }
        }

        return lines.slice(codeStart, codeEnd).join('\n').trim();
    }

    /**
     * Ask clarifying questions (mimics human developer)
     */
    async askQuestion(question) {
        this.emit('question', { question });
        
        return new Promise((resolve) => {
            this.once('answer', (answer) => {
                resolve(answer);
            });
        });
    }

    /**
     * Explain a decision (mimics human developer transparency)
     */
    explainDecision(decision, reasoning) {
        this.emit('explanation', {
            decision,
            reasoning,
            timestamp: new Date()
        });
    }

    /**
     * Get task statistics
     */
    getStatistics() {
        return {
            totalTasks: this.taskHistory.length,
            currentTask: this.currentTask,
            history: this.taskHistory.map(t => ({
                description: t.description,
                duration: t.endTime - t.startTime,
                success: t.success
            }))
        };
    }
}

export default DeveloperAI;
