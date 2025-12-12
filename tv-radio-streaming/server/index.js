import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  freeChannels,
  getAllFreeChannels,
  getChannelStats,
} from './free-channels.js';
import {
  freeRadioStations,
  getAllFreeRadioStations,
  getRadioStats,
} from './free-radio.js';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

app.get('/api/channels', (req, res) => {
  const { country, category } = req.query;
  let channels = getAllFreeChannels();

  if (country) {
    const countryCode = String(country).toUpperCase();
    channels = channels.filter((channel) => channel.country === countryCode);
  }

  if (category) {
    const categoryFilter = String(category).toLowerCase();
    channels = channels.filter(
      (channel) => channel.category.toLowerCase() === categoryFilter,
    );
  }

  res.json(channels);
});

app.get('/api/channels/:id', (req, res) => {
  const channel = freeChannels[req.params.id];

  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }

  res.json(channel);
});

app.get('/api/stream/:id', (req, res) => {
  const channel = freeChannels[req.params.id];

  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }

  res.redirect(channel.stream);
});

app.get('/api/radio', (req, res) => {
  const { country, genre } = req.query;
  let stations = getAllFreeRadioStations();

  if (country) {
    const countryCode = String(country).toUpperCase();
    stations = stations.filter((station) => station.country === countryCode);
  }

  if (genre) {
    const genreFilter = String(genre).toLowerCase();
    stations = stations.filter((station) =>
      station.genre.toLowerCase().includes(genreFilter),
    );
  }

  res.json(stations);
});

app.get('/api/radio/:id', (req, res) => {
  const station = freeRadioStations[req.params.id];

  if (!station) {
    return res.status(404).json({ error: 'Radio station not found' });
  }

  res.json(station);
});

app.get('/api/radio-stream/:id', (req, res) => {
  const station = freeRadioStations[req.params.id];

  if (!station) {
    return res.status(404).json({ error: 'Radio station not found' });
  }

  res.redirect(station.stream);
});

app.get('/api/health', (req, res) => {
  const channelStats = getChannelStats();
  const radioStats = getRadioStats();

  res.json({
    status: 'healthy',
    service: 'TV/Radio Streaming API',
    version: '1.1.0',
    channels: channelStats.totalChannels,
    radioStations: radioStats.totalStations,
    countries: channelStats.totalCountries,
    radioCountries: radioStats.totalCountries,
    categories: channelStats.totalCategories,
    genres: radioStats.totalGenres,
    allFree: channelStats.allFree && radioStats.allFree,
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  const channelStats = getChannelStats();
  const radioStats = getRadioStats();
  const channelCountries = [
    ...new Set(getAllFreeChannels().map((channel) => channel.country)),
  ];
  const radioCountries = [
    ...new Set(getAllFreeRadioStations().map((station) => station.country)),
  ];

  console.log(`\n📺 TV/Radio Streaming API`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(
    `📡 Channels: ${channelStats.totalChannels} across ${channelCountries.length} countries`,
  );
  console.log(
    `📻 Radio Stations: ${radioStats.totalStations} across ${radioCountries.length} countries`,
  );
  console.log(`🌍 Channel Countries: ${channelCountries.join(', ')}`);
  console.log(`📡 Radio Countries: ${radioCountries.join(', ')}`);
  console.log(`\n✅ Ready to stream!\n`);
});
