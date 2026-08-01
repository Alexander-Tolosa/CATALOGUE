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

    let minX = width, maxX = 0, minY = height, maxY = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        const a = this.data[idx + 3];

        // Check if pixel is part of the checkerboard grid background (pure white, grey #CCCCCC, #E0E0E0, #F0F0F0)
        const isWhiteGrid = (r > 240 && g > 240 && b > 240);
        const isGreyGrid = (r > 190 && r < 235 && g > 190 && g < 235 && b > 190 && b < 235 && Math.abs(r - g) < 5 && Math.abs(g - b) < 5);
        const isGridBg = isWhiteGrid || isGreyGrid;

        // Flood-like check: background extends from outer borders
        const isNearBorder = (x < width * 0.15 || x > width * 0.85 || y < height * 0.1 || y > height * 0.9);

        if (isGridBg && (isNearBorder || (x < width * 0.25) || (x > width * 0.75) || (y < height * 0.12))) {
          this.data[idx + 3] = 0; // Set transparent
        } else if (a > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    minX = Math.max(0, minX - 4);
    maxX = Math.min(width - 1, maxX + 4);
    minY = Math.max(0, minY - 4);
    maxY = Math.min(height - 1, maxY + 4);

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
      console.log(`User cat processed & isolated successfully! Dimensions: ${cropWidth}x${cropHeight}`);
    });
  });
