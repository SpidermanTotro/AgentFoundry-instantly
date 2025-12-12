// 💯 100% FREE RADIO STATIONS - LEGAL PUBLIC & AD-SUPPORTED STREAMS

export const freeRadioStations = {
  // 🇩🇪 Germany
  bayern3: {
    id: 'bayern3',
    name: 'Bayern 3',
    country: 'DE',
    stream: 'https://br-br3-live.cast.addradio.de/br/br3/live/mp3/128/stream.mp3',
    type: 'aac',
    bitrate: 128,
    genre: 'Pop / Charts',
    legal: 'Public broadcaster (BR) – tax funded',
  },
  ndr2: {
    id: 'ndr2',
    name: 'NDR 2',
    country: 'DE',
    stream: 'https://ndr-ndr2-niedersachsen.cast.addradio.de/ndr/ndr2/niedersachsen/mp3/128/stream.mp3',
    type: 'mp3',
    bitrate: 128,
    genre: 'Pop Rock',
    legal: 'Public broadcaster (NDR)',
  },
  deutschlandfunk: {
    id: 'deutschlandfunk',
    name: 'Deutschlandfunk',
    country: 'DE',
    stream: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3',
    type: 'mp3',
    bitrate: 128,
    genre: 'News / Talk',
    legal: 'Public national broadcaster',
  },

  // 🇦🇺 Australia
  triplej: {
    id: 'triplej',
    name: 'Triple J',
    country: 'AU',
    stream: 'https://live-radio01.mediahubaustralia.com/2TJW/mp3/',
    type: 'mp3',
    bitrate: 128,
    genre: 'Alternative / Indie',
    legal: 'ABC public broadcaster',
  },
  abcradio: {
    id: 'abcradio',
    name: 'ABC Radio National',
    country: 'AU',
    stream: 'https://live-radio02.mediahubaustralia.com/2RNW/mp3/',
    type: 'mp3',
    bitrate: 96,
    genre: 'News / Talk',
    legal: 'ABC public broadcaster',
  },

  // 🇺🇸 USA
  npr: {
    id: 'npr',
    name: 'NPR Live',
    country: 'US',
    stream: 'https://npr-ice.streamguys1.com/live.mp3',
    type: 'mp3',
    bitrate: 128,
    genre: 'News / Talk',
    legal: 'National Public Radio – listener supported',
  },
  kexp: {
    id: 'kexp',
    name: 'KEXP 90.3 FM Seattle',
    country: 'US',
    stream: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
    type: 'mp3',
    bitrate: 128,
    genre: 'Indie / Alternative',
    legal: 'Listener supported public radio',
  },
  jazz24: {
    id: 'jazz24',
    name: 'Jazz24',
    country: 'US',
    stream: 'https://icy1.abacast.com/kplu-jazz24aac-64',
    type: 'aac',
    bitrate: 64,
    genre: 'Jazz',
    legal: 'Public streaming from KNKX',
  },

  // 🇮🇳 India (All India Radio & Community)
  airnews: {
    id: 'airnews',
    name: 'All India Radio News',
    country: 'IN',
    stream: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspush/airnews/master.m3u8',
    type: 'hls',
    bitrate: 64,
    genre: 'News',
    legal: 'Prasar Bharati (public broadcaster)',
  },
  mirchimumbai: {
    id: 'mirchimumbai',
    name: 'Radio Mirchi Mumbai',
    country: 'IN',
    stream: 'https://prclive1.listenon.in/Mirchi',
    type: 'aac',
    bitrate: 64,
    genre: 'Bollywood / Pop',
    legal: 'Free ad-supported stream',
  },
};

export function getAllFreeRadioStations() {
  return Object.values(freeRadioStations);
}

export function getRadioByCountry(country) {
  return Object.values(freeRadioStations).filter((station) => station.country === country);
}

export function getRadioStats() {
  const stations = getAllFreeRadioStations();
  const countries = [...new Set(stations.map((station) => station.country))];
  const genres = [...new Set(stations.map((station) => station.genre))];

  return {
    totalStations: stations.length,
    totalCountries: countries.length,
    totalGenres: genres.length,
    allFree: true,
  };
}
