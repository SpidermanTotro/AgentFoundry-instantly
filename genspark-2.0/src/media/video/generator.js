class VideoGenerator {
  async generate(prompt, options) {
    console.log(`Generating video: ${prompt}`);
    return { url: '/generated/video.mp4', duration: options.duration };
  }
}
module.exports = VideoGenerator;
