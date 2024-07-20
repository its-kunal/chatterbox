import sharp, { WebpOptions } from "sharp";

const QUALITY = 80;
const CANVAS_SIZE = 250;

function compressBase64Image(base64Data: string) {
  // Default options for compression
  const defaultOptions: WebpOptions = {
    quality: QUALITY, // Adjust quality for JPEG (0-100)
    force: false, // Keep original format if possible,
  };

  // Merge user options with defaults

  return new Promise<string>((resolve, reject) => {
    // Decode Base64 string to Buffer
    let mapBase64 = base64Data.split(";base64,").pop() as string;

    const buffer = Buffer.from(mapBase64, "base64");

    sharp(buffer, { animated: true })
      .webp(defaultOptions)
      .resize(CANVAS_SIZE, CANVAS_SIZE, { fit: "inside" })
      // Apply compression for JPEG
      .toBuffer() // Get compressed image data as Buffer
      .then((compressedData) => {
        // Encode compressed data back to Base64 string
        const appendString = "data:image/webp;base64,";
        const compressedBase64 = compressedData.toString("base64");
        resolve(appendString + compressedBase64);
      })
      .catch((err) => reject(err));
  });
}

export { compressBase64Image };
