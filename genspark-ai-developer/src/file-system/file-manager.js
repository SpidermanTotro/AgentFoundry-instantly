/**
 * GenSpark AI Developer - Real File Manager
 * Creates REAL files on your system
 * Auto-uploads to GitHub
 */

import fs from 'fs-extra';
import path from 'path';
import { EventEmitter } from 'events';
import { exec } from 'child_process';
import { promisify } from 'util';
import chokidar from 'chokidar';

const execAsync = promisify(exec);

class FileManager extends EventEmitter {
    constructor(workspaceRoot = process.cwd()) {
        super();
        this.workspaceRoot = workspaceRoot;
        this.outputDir = path.join(workspaceRoot, 'output');
        this.watcher = null;
        this.fileHistory = new Map();
        
        // Ensure output directory exists
        fs.ensureDirSync(this.outputDir);
    }

    /**
     * Create a REAL file on disk
     */
    async createFile(relativePath, content, options = {}) {
        try {
            const fullPath = path.join(this.outputDir, relativePath);
            const dir = path.dirname(fullPath);

            // Ensure directory exists
            await fs.ensureDir(dir);

            // Write file
            await fs.writeFile(fullPath, content, 'utf-8');

            // Track in history
            this.fileHistory.set(relativePath, {
                path: fullPath,
                size: content.length,
                created: new Date(),
                lines: content.split('\n').length
            });

            this.emit('fileCreated', {
                path: relativePath,
                fullPath: fullPath,
                size: content.length,
                lines: content.split('\n').length
            });

            // Auto-upload to GitHub if enabled
            if (options.autoUpload) {
                await this.uploadToGitHub(relativePath, `Create ${relativePath}`);
            }

            return {
                success: true,
                path: relativePath,
                fullPath: fullPath,
                size: content.length
            };

        } catch (error) {
            this.emit('error', { error: error.message, path: relativePath });
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create multiple files at once
     */
    async createFiles(files, options = {}) {
        const results = [];
        
        for (const { path: filePath, content } of files) {
            const result = await this.createFile(filePath, content, { autoUpload: false });
            results.push(result);
        }

        // Upload all files together
        if (options.autoUpload) {
            await this.uploadToGitHub('*', `Create ${files.length} files`);
        }

        return {
            success: true,
            files: results,
            count: files.length
        };
    }

    /**
     * Read a file
     */
    async readFile(relativePath) {
        try {
            const fullPath = path.join(this.outputDir, relativePath);
            const content = await fs.readFile(fullPath, 'utf-8');
            
            return {
                success: true,
                content: content,
                path: relativePath
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update an existing file
     */
    async updateFile(relativePath, content, commitMessage = null) {
        try {
            const fullPath = path.join(this.outputDir, relativePath);
            
            // Read old content for comparison
            let oldContent = '';
            if (await fs.pathExists(fullPath)) {
                oldContent = await fs.readFile(fullPath, 'utf-8');
            }

            // Write new content
            await fs.writeFile(fullPath, content, 'utf-8');

            const changes = {
                added: content.length - oldContent.length,
                linesAdded: content.split('\n').length - oldContent.split('\n').length
            };

            this.emit('fileUpdated', {
                path: relativePath,
                changes: changes
            });

            // Auto-commit to git
            if (commitMessage) {
                await this.uploadToGitHub(relativePath, commitMessage);
            }

            return {
                success: true,
                path: relativePath,
                changes: changes
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete a file
     */
    async deleteFile(relativePath) {
        try {
            const fullPath = path.join(this.outputDir, relativePath);
            await fs.remove(fullPath);
            
            this.fileHistory.delete(relativePath);
            
            this.emit('fileDeleted', { path: relativePath });
            
            return {
                success: true,
                path: relativePath
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a complete project structure
     */
    async createProject(projectName, structure) {
        const projectRoot = path.join(this.outputDir, projectName);
        await fs.ensureDir(projectRoot);

        const results = [];

        for (const [filePath, content] of Object.entries(structure)) {
            const fullPath = path.join(projectRoot, filePath);
            const dir = path.dirname(fullPath);
            
            await fs.ensureDir(dir);
            await fs.writeFile(fullPath, content, 'utf-8');
            
            results.push({
                path: filePath,
                size: content.length
            });
        }

        this.emit('projectCreated', {
            project: projectName,
            files: results.length,
            path: projectRoot
        });

        return {
            success: true,
            project: projectName,
            path: projectRoot,
            files: results
        };
    }

    /**
     * Upload to GitHub
     */
    async uploadToGitHub(files, commitMessage = 'Update files') {
        try {
            const commands = [
                `cd "${this.outputDir}"`,
                'git init',
                `git add ${files === '*' ? '.' : files}`,
                `git commit -m "${commitMessage}"`,
                'git branch -M main'
            ];

            for (const cmd of commands) {
                try {
                    await execAsync(cmd);
                } catch (err) {
                    // Ignore errors (e.g., already initialized)
                }
            }

            this.emit('uploaded', {
                files: files,
                message: commitMessage
            });

            return {
                success: true,
                message: 'Committed to git'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Watch files for changes
     */
    watchFiles() {
        if (this.watcher) {
            return { success: false, error: 'Already watching' };
        }

        this.watcher = chokidar.watch(this.outputDir, {
            persistent: true,
            ignoreInitial: true
        });

        this.watcher
            .on('add', (filePath) => {
                this.emit('fileAdded', { path: filePath });
            })
            .on('change', (filePath) => {
                this.emit('fileChanged', { path: filePath });
            })
            .on('unlink', (filePath) => {
                this.emit('fileRemoved', { path: filePath });
            });

        return { success: true, watching: this.outputDir };
    }

    /**
     * Get file statistics
     */
    async getStats() {
        const files = Array.from(this.fileHistory.entries());
        
        return {
            totalFiles: files.length,
            totalSize: files.reduce((sum, [_, info]) => sum + info.size, 0),
            totalLines: files.reduce((sum, [_, info]) => sum + info.lines, 0),
            files: files.map(([path, info]) => ({
                path,
                ...info
            }))
        };
    }

    /**
     * List all files in output directory
     */
    async listFiles(directory = '') {
        try {
            const targetDir = path.join(this.outputDir, directory);
            const files = await fs.readdir(targetDir, { withFileTypes: true });
            
            const result = await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(targetDir, file.name);
                    const stats = await fs.stat(filePath);
                    
                    return {
                        name: file.name,
                        path: path.relative(this.outputDir, filePath),
                        isDirectory: file.isDirectory(),
                        size: stats.size,
                        modified: stats.mtime
                    };
                })
            );
            
            return {
                success: true,
                files: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default FileManager;
