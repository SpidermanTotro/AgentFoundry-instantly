class ImageGenerator {
  async generate(prompt, options) {
    console.log(`Generating image: ${prompt}`);
    return { url: '/generated/image.png', ...options };
  }
}
module.exports = ImageGenerator;
