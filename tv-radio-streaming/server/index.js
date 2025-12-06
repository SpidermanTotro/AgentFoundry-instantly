import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

// 📺 German TV Channels (Public Broadcasters - 100% Legal)
const germanChannels = {
  ard: {
    id: 'ard',
    name: 'ARD Das Erste',
    country: 'DE',
    stream: 'https://mcdn.daserste.de/daserste/de/master.m3u8',
    type: 'hls',
    category: 'public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/ARD_logo.svg/200px-ARD_logo.svg.png',
  },
  zdf: {
    id: 'zdf',
    name: 'ZDF',
    country: 'DE',
    stream: 'https://zdf-hls-15.akamaized.net/hls/live/2016498/de/high/master.m3u8',
    type: 'hls',
    category: 'public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/ZDF_logo.svg/200px-ZDF_logo.svg.png',
  },
  arte: {
    id: 'arte',
    name: 'ARTE',
    country: 'DE',
    stream: 'https://artesimulcast.akamaized.net/hls/live/2030993/artelive_de/master.m3u8',
    type: 'hls',
    category: 'public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Arte_Logo_2011.svg/200px-Arte_Logo_2011.svg.png',
  },
  dreisat: {
    id: '3sat',
    name: '3sat',
    country: 'DE',
    stream: 'https://zdf-hls-18.akamaized.net/hls/live/2016500/dach/high/master.m3u8',
    type: 'hls',
    category: 'public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/3sat-Logo.svg/200px-3sat-Logo.svg.png',
  },
};

// 🇦🇺 Australian TV Channels
const australianChannels = {
  abc: {
    id: 'abc',
    name: 'ABC Australia',
    country: 'AU',
    stream: 'https://abc-iview-mediapackagestreams.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8',
    type: 'hls',
    category: 'public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/ABC_Australia_logo.svg/200px-ABC_Australia_logo.svg.png',
  },
  sbs: {
    id: 'sbs',
    name: 'SBS',
    country: 'AU',
    stream: 'https://sbs-live.akamaized.net/hls/live/2002827/channel01/master.m3u8',
    type: 'hls',
    category: 'public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/SBS_logo_2019.svg/200px-SBS_logo_2019.svg.png',
  },
};

// 🇺🇸 USA TV Channels
const usaChannels = {
  cbsnews: {
    id: 'cbsnews',
    name: 'CBS News',
    country: 'US',
    stream: 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8',
    type: 'hls',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/CBS_News.svg/200px-CBS_News.svg.png',
  },
  nbcnews: {
    id: 'nbcnews',
    name: 'NBC News Now',
    country: 'US',
    stream: 'https://nbcnews-lh.akamaihd.net/i/nbcnews_1@174059/master.m3u8',
    type: 'hls',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/NBC_News_2023.svg/200px-NBC_News_2023.svg.png',
  },
};

// All channels
const allChannels = {
  ...germanChannels,
  ...australianChannels,
  ...usaChannels,
};

// API Routes

// Get all channels
app.get('/api/channels', (req, res) => {
  const { country } = req.query;
  
  if (country) {
    const filtered = Object.values(allChannels).filter(ch => ch.country === country);
    return res.json(filtered);
  }
  
  res.json(Object.values(allChannels));
});

// Get channel by ID
app.get('/api/channels/:id', (req, res) => {
  const channel = allChannels[req.params.id];
  
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  res.json(channel);
});

// Get stream URL (proxy endpoint)
app.get('/api/stream/:id', (req, res) => {
  const channel = allChannels[req.params.id];
  
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  // Redirect to actual stream
  res.redirect(channel.stream);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TV/Radio Streaming API',
    version: '1.0.0',
    channels: Object.keys(allChannels).length,
    countries: ['DE', 'AU', 'US'],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n📺 TV/Radio Streaming API`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📡 Channels: ${Object.keys(allChannels).length}`);
  console.log(`🌍 Countries: DE, AU, US`);
  console.log(`\n✅ Ready to stream!\n`);
});

// Serve static files
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/index.html'));
});
