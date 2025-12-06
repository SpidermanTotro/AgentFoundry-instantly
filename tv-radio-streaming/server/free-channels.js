// 💯 100% FREE TV CHANNELS - NO PAYMENT NEEDED!
// All sources are legally available, public broadcasts, or ad-supported

export const freeChannels = {
  
  // 🇩🇪 GERMAN TV (Public Broadcasters - 100% FREE by Law)
  ard: {
    id: 'ard',
    name: 'ARD Das Erste',
    country: 'DE',
    stream: 'https://mcdn.daserste.de/daserste/de/master.m3u8',
    type: 'hls',
    category: 'public',
    free: true,
    legal: 'Public broadcaster - funded by taxes',
  },
  zdf: {
    id: 'zdf',
    name: 'ZDF',
    country: 'DE',
    stream: 'https://zdf-hls-15.akamaized.net/hls/live/2016498/de/high/master.m3u8',
    type: 'hls',
    category: 'public',
    free: true,
    legal: 'Public broadcaster - funded by taxes',
  },
  arte: {
    id: 'arte',
    name: 'ARTE',
    country: 'DE',
    stream: 'https://artesimulcast.akamaized.net/hls/live/2030993/artelive_de/master.m3u8',
    type: 'hls',
    category: 'public',
    free: true,
    legal: 'Public broadcaster - Franco-German cooperation',
  },
  dreisat: {
    id: '3sat',
    name: '3sat',
    country: 'DE',
    stream: 'https://zdf-hls-18.akamaized.net/hls/live/2016500/dach/high/master.m3u8',
    type: 'hls',
    category: 'public',
    free: true,
    legal: 'Public broadcaster - German-Swiss-Austrian',
  },
  
  // 🇦🇺 AUSTRALIAN TV (Public & Free-to-Air - 100% FREE)
  abc: {
    id: 'abc',
    name: 'ABC Australia',
    country: 'AU',
    stream: 'https://abc-iview-mediapackagestreams.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8',
    type: 'hls',
    category: 'public',
    free: true,
    legal: 'Public broadcaster - government funded',
  },
  sbs: {
    id: 'sbs',
    name: 'SBS',
    country: 'AU',
    stream: 'https://sbs-live.akamaized.net/hls/live/2002827/channel01/master.m3u8',
    type: 'hls',
    category: 'public',
    free: true,
    legal: 'Public broadcaster - government funded',
  },
  
  // 🇺🇸 USA TV (Free Ad-Supported - 100% FREE)
  cbsnews: {
    id: 'cbsnews',
    name: 'CBS News',
    country: 'US',
    stream: 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8',
    type: 'hls',
    category: 'news',
    free: true,
    legal: 'Free streaming - ad-supported',
  },
  nbcnews: {
    id: 'nbcnews',
    name: 'NBC News Now',
    country: 'US',
    stream: 'https://nbcnews-lh.akamaihd.net/i/nbcnews_1@174059/master.m3u8',
    type: 'hls',
    category: 'news',
    free: true,
    legal: 'Free streaming - ad-supported',
  },
  abcnews: {
    id: 'abcnews',
    name: 'ABC News Live',
    country: 'US',
    stream: 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8',
    type: 'hls',
    category: 'news',
    free: true,
    legal: 'Free streaming - ad-supported',
  },
  
  // 🌍 INTERNATIONAL NEWS (100% FREE)
  aljazeera: {
    id: 'aljazeera',
    name: 'Al Jazeera English',
    country: 'QA',
    stream: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
    type: 'hls',
    category: 'news',
    free: true,
    legal: 'Free streaming - publicly available',
  },
  france24: {
    id: 'france24',
    name: 'France 24 English',
    country: 'FR',
    stream: 'https://static.france24.com/live/F24_EN_HI_HLS/live_web.m3u8',
    type: 'hls',
    category: 'news',
    free: true,
    legal: 'Public broadcaster - free streaming',
  },
  dwnews: {
    id: 'dwnews',
    name: 'DW News (Deutsche Welle)',
    country: 'DE',
    stream: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    type: 'hls',
    category: 'news',
    free: true,
    legal: 'Public broadcaster - international service',
  },
  
  // 📺 MORE FREE CHANNELS (Pluto TV Style)
  // Note: These are placeholders for channels that require API integration
  // Real Pluto TV channels require their API key (free)
  
  pluto_movies: {
    id: 'pluto_movies',
    name: 'Pluto TV Movies',
    country: 'US',
    stream: 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5cb0cae7a461406ffe3f5213/master.m3u8',
    type: 'hls',
    category: 'movies',
    free: true,
    legal: 'Free ad-supported streaming',
    note: 'One of 300+ free Pluto TV channels',
  },
  
  // 🎵 MUSIC CHANNELS (100% FREE)
  vevo_pop: {
    id: 'vevo_pop',
    name: 'Vevo Pop',
    country: 'US',
    stream: 'https://5dcc6a54d90e8c5dc4345c16-s-5.ssai.zype.com/5dcc6a54d90e8c5dc4345c16-s-5/manifest.m3u8',
    type: 'hls',
    category: 'music',
    free: true,
    legal: 'Free music videos - ad-supported',
  },
};

// Get all free channels
export function getAllFreeChannels() {
  return Object.values(freeChannels);
}

// Get channels by country
export function getChannelsByCountry(country) {
  return Object.values(freeChannels).filter(ch => ch.country === country);
}

// Get channels by category
export function getChannelsByCategory(category) {
  return Object.values(freeChannels).filter(ch => ch.category === category);
}

// Statistics
export function getStats() {
  const channels = getAllFreeChannels();
  const countries = [...new Set(channels.map(ch => ch.country))];
  const categories = [...new Set(channels.map(ch => ch.category))];
  
  return {
    totalChannels: channels.length,
    totalCountries: countries.length,
    totalCategories: categories.length,
    allFree: true,
    costPerMonth: 0,
    costPerYear: 0,
  };
}
