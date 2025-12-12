// 💯 100% FREE TV CHANNELS (Legal public broadcasters & ad-supported streams)

export const freeChannels = {
  // 🇩🇪 Germany (Public broadcasters – tax funded, free by law)
  ard: {
    id: 'ard',
    name: 'ARD Das Erste',
    country: 'DE',
    stream: 'https://mcdn.daserste.de/daserste/de/master.m3u8',
    type: 'tv',
    category: 'Public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/ARD_logo.svg/200px-ARD_logo.svg.png',
    legal: 'Public broadcaster (ARD) – GEZ funded',
  },
  zdf: {
    id: 'zdf',
    name: 'ZDF',
    country: 'DE',
    stream: 'https://zdf-hls-15.akamaized.net/hls/live/2016498/de/high/master.m3u8',
    type: 'tv',
    category: 'Public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/ZDF_logo.svg/200px-ZDF_logo.svg.png',
    legal: 'Public broadcaster (ZDF)',
  },
  arte: {
    id: 'arte',
    name: 'ARTE',
    country: 'DE',
    stream: 'https://artesimulcast.akamaized.net/hls/live/2030993/artelive_de/master.m3u8',
    type: 'tv',
    category: 'Culture',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Arte_Logo_2011.svg/200px-Arte_Logo_2011.svg.png',
    legal: 'Public broadcaster – France/Germany partnership',
  },
  dreisat: {
    id: '3sat',
    name: '3sat',
    country: 'DE',
    stream: 'https://zdf-hls-18.akamaized.net/hls/live/2016500/dach/high/master.m3u8',
    type: 'tv',
    category: 'Culture',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/3sat-Logo.svg/200px-3sat-Logo.svg.png',
    legal: 'Public broadcaster (DE/AT/CH)',
  },

  // 🇦🇺 Australia (Public broadcasters – free and legal)
  abc: {
    id: 'abc',
    name: 'ABC Australia',
    country: 'AU',
    stream: 'https://abc-iview-mediapackagestreams.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8',
    type: 'tv',
    category: 'Public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/ABC_Australia_logo.svg/200px-ABC_Australia_logo.svg.png',
    legal: 'ABC public broadcaster',
  },
  sbs: {
    id: 'sbs',
    name: 'SBS',
    country: 'AU',
    stream: 'https://sbs-live.akamaized.net/hls/live/2002827/channel01/master.m3u8',
    type: 'tv',
    category: 'Public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/SBS_logo_2019.svg/200px-SBS_logo_2019.svg.png',
    legal: 'SBS public broadcaster',
  },

  // 🇺🇸 United States (Free ad-supported or public streams)
  cbsnews: {
    id: 'cbsnews',
    name: 'CBS News',
    country: 'US',
    stream: 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8',
    type: 'tv',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/CBS_News.svg/200px-CBS_News.svg.png',
    legal: 'Ad-supported free stream',
  },
  nbcnews: {
    id: 'nbcnews',
    name: 'NBC News Now',
    country: 'US',
    stream: 'https://nbcnews-lh.akamaihd.net/i/nbcnews_1@174059/master.m3u8',
    type: 'tv',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/NBC_News_2023.svg/200px-NBC_News_2023.svg.png',
    legal: 'Ad-supported free stream',
  },
  abcnews: {
    id: 'abcnews',
    name: 'ABC News Live',
    country: 'US',
    stream: 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8',
    type: 'tv',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/ABC_News_live_logo.png/200px-ABC_News_live_logo.png',
    legal: 'Ad-supported free stream',
  },
  pluto_movies: {
    id: 'pluto_movies',
    name: 'Pluto TV Movies',
    country: 'US',
    stream: 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5cb0cae7a461406ffe3f5213/master.m3u8',
    type: 'tv',
    category: 'Movies',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pluto_tv_logo.svg/200px-Pluto_tv_logo.svg.png',
    legal: 'Pluto TV (ad-supported)',
  },
  vevo_pop: {
    id: 'vevo_pop',
    name: 'Vevo Pop',
    country: 'US',
    stream: 'https://5dcc6a54d90e8c5dc4345c16-s-5.ssai.zype.com/5dcc6a54d90e8c5dc4345c16-s-5/manifest.m3u8',
    type: 'tv',
    category: 'Music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/VEVO_logo.png/200px-VEVO_logo.png',
    legal: 'Vevo free streaming',
  },

  // 🇮🇳 India (Public & free-to-air streams)
  ddnational: {
    id: 'ddnational',
    name: 'DD National',
    country: 'IN',
    stream: 'https://d2r5qnx1eh4o0f.cloudfront.net/bpk-tv/Doordarshan1/default/index.m3u8',
    type: 'tv',
    category: 'Public',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/DD_National_new_logo_2019.png/200px-DD_National_new_logo_2019.png',
    legal: 'Doordarshan (public broadcaster)',
  },
  ddnews: {
    id: 'ddnews',
    name: 'DD News',
    country: 'IN',
    stream: 'https://d2913klap3hbty.cloudfront.net/out/v1/6056a1b99e0547f8837bffb0c8d93b03/index.m3u8',
    type: 'tv',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/DD_News_logo.png/200px-DD_News_logo.png',
    legal: 'Doordarshan (public broadcaster)',
  },
  sansadtv: {
    id: 'sansadtv',
    name: 'Sansad TV',
    country: 'IN',
    stream: 'https://nicls2-lh.akamaihd.net/i/lstv_1@662110/master.m3u8',
    type: 'tv',
    category: 'Public',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Sansad_TV_logo.png/200px-Sansad_TV_logo.png',
    legal: 'Indian Parliament channel',
  },
  bindass: {
    id: 'bindass',
    name: 'Bindass (Free Stream)',
    country: 'IN',
    stream: 'https://edge-ap2.cloudfrontcdn.in.net/hls/bindass/index.m3u8',
    type: 'tv',
    category: 'Entertainment',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Bindass_logo.png/200px-Bindass_logo.png',
    legal: 'Free-to-air digital stream (ad-supported)',
  },
  luca: {
    id: 'luca',
    name: 'Luca TV',
    country: 'IN',
    stream: 'https://luca-live.cdnwiz.com/hls/stream.m3u8',
    type: 'tv',
    category: 'Movies',
    logo: 'https://luca-tv-static.s3.amazonaws.com/logo.png',
    legal: 'Free OTT channel (ad-supported)',
  },

  // 🌍 International News (always free)
  aljazeera: {
    id: 'aljazeera',
    name: 'Al Jazeera English',
    country: 'QA',
    stream: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
    type: 'tv',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Al_Jazeera_English_logo.svg/200px-Al_Jazeera_English_logo.svg.png',
    legal: 'Official international stream',
  },
  france24: {
    id: 'france24',
    name: 'France 24 (EN)',
    country: 'FR',
    stream: 'https://static.france24.com/live/F24_EN_HI_HLS/live_web.m3u8',
    type: 'tv',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/FRANCE_24_logo.svg/200px-FRANCE_24_logo.svg.png',
    legal: 'Public broadcaster (France Médias Monde)',
  },
  dwnews: {
    id: 'dwnews',
    name: 'DW News',
    country: 'DE',
    stream: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    type: 'tv',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Deutsche_Welle_logo.svg/200px-Deutsche_Welle_logo.svg.png',
    legal: 'German international broadcaster',
  },
};

export function getAllFreeChannels() {
  return Object.values(freeChannels);
}

export function getChannelsByCountry(country) {
  return Object.values(freeChannels).filter((channel) => channel.country === country);
}

export function getChannelsByCategory(category) {
  return Object.values(freeChannels).filter((channel) => channel.category === category);
}

export function getChannelStats() {
  const channels = getAllFreeChannels();
  const countries = [...new Set(channels.map((ch) => ch.country))];
  const categories = [...new Set(channels.map((ch) => ch.category))];

  return {
    totalChannels: channels.length,
    totalCountries: countries.length,
    totalCategories: categories.length,
    allFree: true,
  };
}
