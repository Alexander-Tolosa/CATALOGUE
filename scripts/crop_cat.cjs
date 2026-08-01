const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '../public/kleo_mascot.png');
const outputPathPublic = path.join(__dirname, '../public/kleo_cat_isolated.png');
const outputPathAssets = path.join(__dirname, '../src/assets/kleo_cat_isolated.png');

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function () {
    const width = this.width;
    const height = this.height;

    // Bounding box trackers for the cat figure
    let minX = width, maxX = 0, minY = height, maxY = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];

        // Filter out callout boxes: top-left (12-day streak) & bottom-right (Scripts first)
        const isTopLeftCallout = (x < width * 0.35 && y < height * 0.35);
        const isBottomRightCallout = (x > width * 0.62 && y > height * 0.68);

        // Detect beige background (warm cream gradient tones: R > 200, G > 180, B > 160)
        const isBeigeBg = (r > 200 && g > 180 && b > 155 && Math.abs(r - g) < 45 && (r - b) > 5 && (r - b) < 70);

        if (isTopLeftCallout || isBottomRightCallout || isBeigeBg) {
          this.data[idx + 3] = 0; // Alpha = 0 (Transparent)
        } else {
          // Valid cat pixel
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
      console.log(`Cat isolated successfully! Bounding Box: ${cropWidth}x${cropHeight}`);
    });
  });
