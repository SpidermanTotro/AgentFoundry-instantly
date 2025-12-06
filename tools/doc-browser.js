#!/usr/bin/env node
/**
 * Documentation Browser - Interactive CLI tool
 * Browse all project documentation files
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DOCS_DIR = path.join(__dirname, '..');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

class DocBrowser {
  constructor() {
    this.docs = this.loadDocs();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  loadDocs() {
    try {
      const files = fs.readdirSync(DOCS_DIR)
        .filter(f => f.endsWith('.md') || f.endsWith('.txt'));
      
      return files.map(f => {
        const fullPath = path.join(DOCS_DIR, f);
        const content = fs.readFileSync(fullPath, 'utf8');
        const stats = fs.statSync(fullPath);
        
        return {
          name: f,
          path: fullPath,
          size: stats.size,
          lines: content.split('\n').length,
          content: content,
          preview: content.substring(0, 150).split('\n')[0]
        };
      }).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error loading docs:', error.message);
      return [];
    }
  }

  printHeader() {
    console.clear();
    console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║     ChatGPT 2.0 - Documentation Browser               ║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);
  }

  printMenu() {
    this.printHeader();
    console.log(`${colors.green}📚 Available Documentation (${this.docs.length} files)${colors.reset}\n`);

    // Group by category
    const categories = {
      'Project Guides': this.docs.filter(d => d.name.includes('COMPLETE') || d.name.includes('GUIDE')),
      'Status Reports': this.docs.filter(d => d.name.includes('STATUS') || d.name.includes('REPORT')),
      'Technical Docs': this.docs.filter(d => d.name.includes('BUILD') || d.name.includes('INSTALL') || d.name === 'README.md'),
      'Feature Docs': this.docs.filter(d => d.name.includes('FEATURES') || d.name.includes('UI'))
    };

    let index = 1;
    for (const [category, docs] of Object.entries(categories)) {
      if (docs.length > 0) {
        console.log(`${colors.yellow}${category}:${colors.reset}`);
        for (const doc of docs) {
          const size = (doc.size / 1024).toFixed(1);
          console.log(`  ${colors.cyan}${index}.${colors.reset} ${doc.name} ${colors.blue}(${size}KB, ${doc.lines} lines)${colors.reset}`);
          console.log(`     ${colors.magenta}${doc.preview}...${colors.reset}\n`);
          index++;
        }
      }
    }

    console.log(`\n${colors.green}Commands:${colors.reset}`);
    console.log(`  ${colors.cyan}1-${this.docs.length}${colors.reset} - View document`);
    console.log(`  ${colors.cyan}s${colors.reset} [query]  - Search documents`);
    console.log(`  ${colors.cyan}l${colors.reset}         - List all`);
    console.log(`  ${colors.cyan}q${colors.reset}         - Quit\n`);
  }

  async showDocument(index) {
    const doc = this.docs[index - 1];
    if (!doc) {
      console.log(`${colors.yellow}Invalid document number${colors.reset}`);
      return;
    }

    console.clear();
    console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║  ${doc.name.padEnd(52)}║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);
    
    console.log(`${colors.blue}Size: ${(doc.size/1024).toFixed(1)}KB | Lines: ${doc.lines}${colors.reset}\n`);
    console.log(doc.content);
    console.log(`\n${colors.yellow}Press Enter to continue...${colors.reset}`);
    
    await new Promise(resolve => {
      this.rl.once('line', resolve);
    });
  }

  search(query) {
    console.clear();
    console.log(`${colors.green}🔍 Search Results for: "${query}"${colors.reset}\n`);

    const results = this.docs.filter(doc =>
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      doc.content.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
      console.log(`${colors.yellow}No results found${colors.reset}\n`);
    } else {
      results.forEach((doc, i) => {
        console.log(`${colors.cyan}${i + 1}. ${doc.name}${colors.reset}`);
        
        // Find matching lines
        const lines = doc.content.split('\n');
        const matches = lines.filter(line => 
          line.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);
        
        matches.forEach(match => {
          const highlighted = match.replace(
            new RegExp(query, 'gi'),
            `${colors.yellow}$&${colors.reset}`
          );
          console.log(`   ${highlighted}`);
        });
        console.log();
      });
    }

    console.log(`${colors.yellow}Press Enter to continue...${colors.reset}`);
  }

  async run() {
    this.printMenu();

    this.rl.on('line', async (input) => {
      const cmd = input.trim();

      if (cmd === 'q') {
        console.log(`\n${colors.green}Goodbye!${colors.reset}\n`);
        this.rl.close();
        process.exit(0);
      } else if (cmd === 'l') {
        this.printMenu();
      } else if (cmd.startsWith('s ')) {
        const query = cmd.substring(2);
        this.search(query);
        await new Promise(resolve => this.rl.once('line', resolve));
        this.printMenu();
      } else if (!isNaN(cmd) && parseInt(cmd) > 0 && parseInt(cmd) <= this.docs.length) {
        await this.showDocument(parseInt(cmd));
        this.printMenu();
      } else if (cmd) {
        console.log(`${colors.yellow}Unknown command${colors.reset}`);
        this.printMenu();
      }
    });
  }
}

// Run the browser
const browser = new DocBrowser();
browser.run();
