const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\5941472e-3517-42d6-9450-a3b08e33d869\\media__1785552159292.png';
const outputPathPublic = path.join(__dirname, '../public/kleo_cat_isolated.png');
const outputPathAssets = path.join(__dirname, '../src/assets/kleo_cat_isolated.png');

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function () {
    const width = this.width;
    const height = this.height;

    // Helper: check if a pixel is background (checkerboard white/grey or dark padding)
    const isBgPixel = (idx) => {
      const r = this.data[idx];
      const g = this.data[idx + 1];
      const b = this.data[idx + 2];

      const isWhite = (r > 230 && g > 230 && b > 230);
      const isGreySquare = (Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12 && r >= 160 && r <= 235);
      const isDarkBorder = (r < 50 && g < 50 && b < 50);

      // Check if it's NOT cat fur/scarf/eyes
      const isCatBlueScarf = (b > 130 && b > r + 30 && b > g + 20);
      const isCatEye = (b > 150 && g > 100 && r < 100);
      const isCatWarmFur = (r > 160 && g > 130 && r > b + 15);

      if (isCatBlueScarf || isCatEye || isCatWarmFur) {
        return false;
      }

      return isWhite || isGreySquare || isDarkBorder;
    };

    // Breadth-First-Search (BFS) Flood Fill from outer border pixels
    const visited = new Uint8Array(width * height);
    const queue = [];

    // Push all border pixels to queue
    for (let x = 0; x < width; x++) {
      queue.push([x, 0], [x, height - 1]);
    }
    for (let y = 0; y < height; y++) {
      queue.push([0, y], [width - 1, y]);
    }

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const pixelIdx = y * width + x;
      if (visited[pixelIdx]) continue;
      visited[pixelIdx] = 1;

      const idx = pixelIdx << 2;
      if (isBgPixel(idx)) {
        this.data[idx + 3] = 0; // Set transparent

        // Neighbors (4-directional)
        if (x > 0) queue.push([x - 1, y]);
        if (x < width - 1) queue.push([x + 1, y]);
        if (y > 0) queue.push([x, y - 1]);
        if (y < height - 1) queue.push([x, y + 1]);
      }
    }

    // Bounding Box crop for isolated cat
    let minX = width, maxX = 0, minY = height, maxY = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        if (this.data[idx + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    minX = Math.max(0, minX - 2);
    maxX = Math.min(width - 1, maxX + 2);
    minY = Math.max(0, minY - 2);
    maxY = Math.min(height - 1, maxY + 2);

    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;

    const cropped = new PNG({ width: cropWidth, height: cropHeight });

    for (let y = 0; y < cropHeight; y++) {
      for (let x = 0; x < cropWidth; x++) {
        const srcIdx = (width * (y + minY) + (x + minX)) << 2;
        const destIdx = (cropWidth * y + x) << 2;

        cropped.data[destIdx] = this.data[srcIdx];
        cropped.data[destIdx + 1] = this.data[srcIdx + 1];
        cropped.data[destIdx + 2] = this.data[srcIdx + 2];
        cropped.data[destIdx + 3] = this.data[srcIdx + 3];
      }
    }

    const outStream = fs.createWriteStream(outputPathPublic);
    cropped.pack().pipe(outStream).on('finish', () => {
      fs.copyFileSync(outputPathPublic, outputPathAssets);
      console.log(`Checkerboard & background removed! Isolated Cat Dimensions: ${cropWidth}x${cropHeight}`);
    });
  });
