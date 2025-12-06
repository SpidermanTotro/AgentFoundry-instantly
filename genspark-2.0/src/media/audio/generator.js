class AudioGenerator {
  async generate(text, options) {
    console.log(`Generating audio: ${text}`);
    return { url: '/generated/audio.mp3', duration: 10 };
  }
}
module.exports = AudioGenerator;
