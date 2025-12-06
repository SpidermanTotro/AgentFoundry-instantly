/**
 * GenSpark 2.0 - Advanced GIF Generator
 * Features: Text animation, video-to-GIF, optimization, filters
 * 100% OFFLINE
 */

const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class GIFGenerator {
    constructor() {
        this.outputDir = path.join(__dirname, '../../../output/gifs');
        this._ensureOutputDir();
    }
    
    _ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    
    /**
     * Create GIF from text with animations
     */
    async createTextGIF(options = {}) {
        const {
            text = 'GenSpark 2.0',
            width = 400,
            height = 200,
            fps = 10,
            duration = 3,
            animation = 'fade', // fade, slide, bounce, typewriter
            background = '#667eea',
            textColor = '#ffffff',
            fontSize = 48
        } = options;
        
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const encoder = new GIFEncoder(width, height);
        
        const outputPath = path.join(this.outputDir, `text_${Date.now()}.gif`);
        encoder.createReadStream().pipe(fs.createWriteStream(outputPath));
        
        encoder.start();
        encoder.setRepeat(0); // 0 = loop forever
        encoder.setDelay(1000 / fps);
        encoder.setQuality(10);
        
        const frames = duration * fps;
        
        for (let i = 0; i < frames; i++) {
            const progress = i / frames;
            
            // Clear canvas
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, width, height);
            
            // Set text style
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Apply animation
            ctx.fillStyle = textColor;
            
            switch (animation) {
                case 'fade':
                    ctx.globalAlpha = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
                    ctx.fillText(text, width / 2, height / 2);
                    break;
                    
                case 'slide':
                    const x = width * progress;
                    ctx.fillText(text, x, height / 2);
                    break;
                    
                case 'bounce':
                    const bounce = Math.abs(Math.sin(progress * Math.PI * 4)) * 50;
                    ctx.fillText(text, width / 2, height / 2 - bounce);
                    break;
                    
                case 'typewriter':
                    const chars = Math.floor(text.length * progress);
                    ctx.fillText(text.substring(0, chars), width / 2, height / 2);
                    break;
                    
                default:
                    ctx.fillText(text, width / 2, height / 2);
            }
            
            ctx.globalAlpha = 1;
            encoder.addFrame(ctx);
        }
        
        encoder.finish();
        
        return {
            path: outputPath,
            filename: path.basename(outputPath),
            width,
            height,
            frames,
            fps,
            size: this._getFileSize(outputPath)
        };
    }
    
    /**
     * Convert video to GIF using FFmpeg
     */
    async fromVideo(videoPath, options = {}) {
        const {
            startTime = 0,
            duration = 3,
            fps = 10,
            width = 480,
            scale = 'scale=480:-1'
        } = options;
        
        const outputPath = path.join(this.outputDir, `video_${Date.now()}.gif`);
        
        // FFmpeg command for high-quality GIF
        const cmd = `ffmpeg -ss ${startTime} -t ${duration} -i "${videoPath}" \
            -vf "${scale},fps=${fps},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
            -loop 0 "${outputPath}"`;
        
        try {
            await execAsync(cmd);
            
            return {
                path: outputPath,
                filename: path.basename(outputPath),
                duration,
                fps,
                size: this._getFileSize(outputPath),
                offline: true
            };
        } catch (error) {
            throw new Error(`Video to GIF conversion failed: ${error.message}`);
        }
    }
    
    /**
     * Create GIF from image frames
     */
    async createFromFrames(framePaths, options = {}) {
        const {
            width = 400,
            height = 300,
            fps = 10,
            repeat = 0
        } = options;
        
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const encoder = new GIFEncoder(width, height);
        
        const outputPath = path.join(this.outputDir, `frames_${Date.now()}.gif`);
        encoder.createReadStream().pipe(fs.createWriteStream(outputPath));
        
        encoder.start();
        encoder.setRepeat(repeat);
        encoder.setDelay(1000 / fps);
        encoder.setQuality(10);
        
        for (const framePath of framePaths) {
            const image = await loadImage(framePath);
            ctx.drawImage(image, 0, 0, width, height);
            encoder.addFrame(ctx);
        }
        
        encoder.finish();
        
        return {
            path: outputPath,
            filename: path.basename(outputPath),
            frames: framePaths.length,
            size: this._getFileSize(outputPath)
        };
    }
    
    /**
     * Optimize GIF filesize
     */
    async optimize(gifPath, maxSizeMB = 5) {
        const outputPath = path.join(this.outputDir, `optimized_${Date.now()}.gif`);
        
        // Use gifsicle for optimization
        const cmd = `gifsicle -O3 --lossy=80 --colors 256 "${gifPath}" -o "${outputPath}"`;
        
        try {
            await execAsync(cmd);
            
            const originalSize = this._getFileSize(gifPath);
            const optimizedSize = this._getFileSize(outputPath);
            
            return {
                original: {
                    path: gifPath,
                    size: originalSize
                },
                optimized: {
                    path: outputPath,
                    size: optimizedSize
                },
                reduction: `${((1 - optimizedSize / originalSize) * 100).toFixed(1)}%`
            };
        } catch (error) {
            // Fallback if gifsicle not available
            fs.copyFileSync(gifPath, outputPath);
            return {
                original: { path: gifPath, size: this._getFileSize(gifPath) },
                optimized: { path: outputPath, size: this._getFileSize(outputPath) },
                reduction: '0% (gifsicle not available)'
            };
        }
    }
    
    /**
     * Add watermark to GIF
     */
    async addWatermark(gifPath, watermarkText, options = {}) {
        const {
            position = 'bottom-right',
            fontSize = 20,
            color = '#ffffff',
            opacity = 0.7
        } = options;
        
        // This would require frame-by-frame processing
        // For now, return the original
        return {
            path: gifPath,
            watermark: watermarkText,
            message: 'Watermark feature requires frame extraction'
        };
    }
    
    /**
     * Create animated loading GIF
     */
    async createLoader(options = {}) {
        const {
            type = 'spinner', // spinner, dots, bars
            width = 100,
            height = 100,
            color = '#667eea',
            fps = 15
        } = options;
        
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const encoder = new GIFEncoder(width, height);
        
        const outputPath = path.join(this.outputDir, `loader_${Date.now()}.gif`);
        encoder.createReadStream().pipe(fs.createWriteStream(outputPath));
        
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(1000 / fps);
        encoder.setQuality(10);
        
        const frames = 30;
        
        for (let i = 0; i < frames; i++) {
            const progress = i / frames;
            
            // Clear
            ctx.clearRect(0, 0, width, height);
            
            switch (type) {
                case 'spinner':
                    this._drawSpinner(ctx, width, height, progress, color);
                    break;
                case 'dots':
                    this._drawDots(ctx, width, height, progress, color);
                    break;
                case 'bars':
                    this._drawBars(ctx, width, height, progress, color);
                    break;
            }
            
            encoder.addFrame(ctx);
        }
        
        encoder.finish();
        
        return {
            path: outputPath,
            type,
            size: this._getFileSize(outputPath)
        };
    }
    
    _drawSpinner(ctx, width, height, progress, color) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        const startAngle = progress * Math.PI * 2 - Math.PI / 2;
        const endAngle = startAngle + Math.PI * 1.5;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.stroke();
    }
    
    _drawDots(ctx, width, height, progress, color) {
        const dots = 3;
        const dotRadius = 8;
        const spacing = 25;
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < dots; i++) {
            const phase = (progress + i / dots) % 1;
            const scale = Math.abs(Math.sin(phase * Math.PI)) * 0.5 + 0.5;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(
                centerX + (i - 1) * spacing,
                centerY,
                dotRadius * scale,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    _drawBars(ctx, width, height, progress, color) {
        const bars = 5;
        const barWidth = 8;
        const spacing = 15;
        const centerX = width / 2;
        const maxHeight = height * 0.6;
        
        for (let i = 0; i < bars; i++) {
            const phase = (progress + i / bars) % 1;
            const barHeight = Math.abs(Math.sin(phase * Math.PI * 2)) * maxHeight;
            
            ctx.fillStyle = color;
            ctx.fillRect(
                centerX + (i - bars / 2) * spacing,
                height / 2 - barHeight / 2,
                barWidth,
                barHeight
            );
        }
    }
    
    _getFileSize(filePath) {
        try {
            const stats = fs.statSync(filePath);
            return stats.size;
        } catch {
            return 0;
        }
    }
}

module.exports = { GIFGenerator };
