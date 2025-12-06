const express = require('express');
const path = require('path');
const { Octokit } = require('octokit');

const app = express();
const PORT = 3004;

app.use(express.json());
app.use(express.static('public'));

// GitHub 2.0 API endpoints
const githubAPI = {
  // Initialize Octokit
  getClient: (token) => {
    return new Octokit({ auth: token });
  },

  // Get user info
  async getUser(octokit) {
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  },

  // List repositories
  async listRepos(octokit, username) {
    const { data } = await octokit.rest.repos.listForUser({ username, per_page: 100 });
    return data;
  },

  // Get repository details
  async getRepo(octokit, owner, repo) {
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return data;
  },

  // List issues
  async listIssues(octokit, owner, repo) {
    const { data } = await octokit.rest.issues.listForRepo({ owner, repo });
    return data;
  },

  // List pull requests
  async listPRs(octokit, owner, repo) {
    const { data } = await octokit.rest.pulls.list({ owner, repo });
    return data;
  },

  // Get file contents
  async getFileContent(octokit, owner, repo, path) {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    return data;
  },

  // Create issue
  async createIssue(octokit, owner, repo, title, body) {
    const { data } = await octokit.rest.issues.create({ owner, repo, title, body });
    return data;
  },

  // Create pull request
  async createPR(octokit, owner, repo, title, body, head, base) {
    const { data } = await octokit.rest.pulls.create({ owner, repo, title, body, head, base });
    return data;
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'GitHub 2.0',
    version: '2.0.0',
    features: [
      'Repository browsing',
      'Issue management',
      'Pull request management',
      'Code browsing',
      'AI-powered insights'
    ]
  });
});

app.post('/api/github/user', async (req, res) => {
  try {
    const { token } = req.body;
    const octokit = githubAPI.getClient(token);
    const user = await githubAPI.getUser(octokit);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/github/repos', async (req, res) => {
  try {
    const { token, username } = req.body;
    const octokit = githubAPI.getClient(token);
    const repos = await githubAPI.listRepos(octokit, username);
    res.json({ success: true, repos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/github/repo', async (req, res) => {
  try {
    const { token, owner, repo } = req.body;
    const octokit = githubAPI.getClient(token);
    const repoData = await githubAPI.getRepo(octokit, owner, repo);
    res.json({ success: true, repo: repoData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/github/issues', async (req, res) => {
  try {
    const { token, owner, repo } = req.body;
    const octokit = githubAPI.getClient(token);
    const issues = await githubAPI.listIssues(octokit, owner, repo);
    res.json({ success: true, issues });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/github/pulls', async (req, res) => {
  try {
    const { token, owner, repo } = req.body;
    const octokit = githubAPI.getClient(token);
    const pulls = await githubAPI.listPRs(octokit, owner, repo);
    res.json({ success: true, pulls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/github/content', async (req, res) => {
  try {
    const { token, owner, repo, path: filePath } = req.body;
    const octokit = githubAPI.getClient(token);
    const content = await githubAPI.getFileContent(octokit, owner, repo, filePath);
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/github/issue/create', async (req, res) => {
  try {
    const { token, owner, repo, title, body } = req.body;
    const octokit = githubAPI.getClient(token);
    const issue = await githubAPI.createIssue(octokit, owner, repo, title, body);
    res.json({ success: true, issue });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/github/pr/create', async (req, res) => {
  try {
    const { token, owner, repo, title, body, head, base } = req.body;
    const octokit = githubAPI.getClient(token);
    const pr = await githubAPI.createPR(octokit, owner, repo, title, body, head, base);
    res.json({ success: true, pr });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 GitHub 2.0 Server Running!`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/health\n`);
});
