import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Generates an official landscape A4 Certificate of Language Proficiency
 * @param {Object} params
 * @param {string} params.userName - Learner's full name
 * @param {string} params.languageName - Language name (e.g. English, Korean, Japanese)
 * @param {string} params.levelName - Level title (e.g. "JLPT N1 — Advanced / Mastery")
 * @param {string} params.levelCode - Level code (e.g. "N1", "Level 6", "C2")
 * @param {string} params.code - Unique verification code (e.g. "CAT-JA-N1-8921")
 * @param {string} [params.verifyUrl] - Short verification URL
 * @param {string} [params.outputPath] - Local path to save the PDF
 * @returns {Promise<string>} - Resolves with the saved output path
 */
async function generateCertificatePdf({
  userName,
  languageName,
  levelName,
  levelCode,
  code,
  verifyUrl,
  outputPath
}) {
  const uploadsDir = path.dirname(outputPath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const effectiveVerifyUrl = verifyUrl || `http://localhost:3000/verify/${code}`;

  // Generate QR Code as PNG Buffer
  const qrBuffer = await QRCode.toBuffer(effectiveVerifyUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 120,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });

  return new Promise((resolve, reject) => {
    // Landscape A4: 841.89 x 595.28 points
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 30, bottom: 30, left: 30, right: 30 }
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const width = 841.89;
    const height = 595.28;

    // Background Canvas
    doc.rect(0, 0, width, height).fill('#0B101D');

    // Outer Decorative Border (Cyan & Teal Gradient aesthetic)
    doc.lineWidth(4);
    doc.strokeColor('#38BDF8');
    doc.rect(24, 24, width - 48, height - 48).stroke();

    // Inner Delicate Gold / Cyan Border
    doc.lineWidth(1);
    doc.strokeColor('#22D3EE');
    doc.rect(30, 30, width - 60, height - 60).stroke();

    // Corner Accents
    const cornerSize = 16;
    const corners = [
      [30, 30],
      [width - 30 - cornerSize, 30],
      [30, height - 30 - cornerSize],
      [width - 30 - cornerSize, height - 30 - cornerSize]
    ];
    doc.fillColor('#38BDF8');
    corners.forEach(([cx, cy]) => {
      doc.rect(cx, cy, cornerSize, cornerSize).fill('#0284C7');
    });

    // Top Header: App Branding
    doc.font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('#38BDF8')
      .text('C A T A L O G U E', 0, 56, { align: 'center', characterSpacing: 4 });

    doc.font('Helvetica')
      .fontSize(9)
      .fillColor('#94A3B8')
      .text('GLOBAL AI-POWERED LANGUAGE ACADEMY & PROFICIENCY BENCHMARK', 0, 76, { align: 'center', characterSpacing: 1.5 });

    // Main Certificate Heading
    doc.font('Helvetica-Bold')
      .fontSize(28)
      .fillColor('#F8FAFC')
      .text('CERTIFICATE OF PROFICIENCY', 0, 110, { align: 'center' });

    doc.font('Helvetica-Oblique')
      .fontSize(11)
      .fillColor('#94A3B8')
      .text('This credential officially attests that', 0, 155, { align: 'center' });

    // Learner's Name
    doc.font('Helvetica-Bold')
      .fontSize(32)
      .fillColor('#38BDF8')
      .text(userName.toUpperCase(), 0, 185, { align: 'center' });

    // Decorative underline for name
    const lineWidth = 340;
    doc.lineWidth(1.5)
      .strokeColor('#38BDF8')
      .moveTo((width - lineWidth) / 2, 228)
      .lineTo((width + lineWidth) / 2, 228)
      .stroke();

    // Course completion text
    doc.font('Helvetica')
      .fontSize(12)
      .fillColor('#E2E8F0')
      .text(
        `has fulfilled all academic requirements, module mastery, and comprehensive examination standards in`,
        60,
        246,
        { align: 'center', width: width - 120 }
      );

    // Track & Level Badge
    doc.font('Helvetica-Bold')
      .fontSize(20)
      .fillColor('#22D3EE')
      .text(`${languageName.toUpperCase()} — ${levelName.toUpperCase()}`, 60, 276, {
        align: 'center',
        width: width - 120
      });

    // Description text
    doc.font('Helvetica')
      .fontSize(10)
      .fillColor('#94A3B8')
      .text(
        `Certified level achievement demonstrating standardized competence (CEFR / TOPIK / JLPT Standard).`,
        60,
        312,
        { align: 'center', width: width - 120 }
      );

    // Metadata Footer Section: Left = Signatures, Center = Security Seal, Right = QR Verification
    const footerY = 380;

    // 1. Left: Signatures & Issue Date
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#E2E8F0').text('AUTHORIZED ACADEMIC BOARD', 70, footerY);
    doc.font('Helvetica-Oblique').fontSize(16).fillColor('#38BDF8').text('Kleo AI Academic Chancellor', 70, footerY + 22);
    doc.lineWidth(1).strokeColor('#475569').moveTo(70, footerY + 48).lineTo(260, footerY + 48).stroke();
    
    const issueDateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.font('Helvetica').fontSize(9).fillColor('#94A3B8').text(`Date of Issuance: ${issueDateStr}`, 70, footerY + 54);

    // 2. Center: Gold Verified Seal Emblem
    const sealCenterX = width / 2;
    doc.circle(sealCenterX, footerY + 36, 38).lineWidth(2).strokeColor('#F59E0B').stroke();
    doc.circle(sealCenterX, footerY + 36, 33).lineWidth(1).strokeColor('#F59E0B').stroke();
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#F59E0B').text('CATALOGUE', sealCenterX - 35, footerY + 20, { width: 70, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#FDE68A').text('OFFICIAL', sealCenterX - 35, footerY + 33, { width: 70, align: 'center' });
    doc.font('Helvetica').fontSize(7).fillColor('#F59E0B').text('VERIFIED', sealCenterX - 35, footerY + 45, { width: 70, align: 'center' });

    // 3. Right: QR Code & Verification Info
    const qrX = width - 190;
    doc.image(qrBuffer, qrX, footerY - 10, { width: 85, height: 85 });

    doc.font('Helvetica-Bold').fontSize(8).fillColor('#38BDF8').text('SCAN TO VERIFY', qrX - 5, footerY + 80, { width: 95, align: 'center' });
    doc.font('Helvetica').fontSize(7.5).fillColor('#94A3B8').text(`ID: ${code}`, qrX - 25, footerY + 92, { width: 135, align: 'center' });
    doc.font('Helvetica').fontSize(7).fillColor('#64748B').text(effectiveVerifyUrl, qrX - 45, footerY + 104, { width: 175, align: 'center' });

    doc.end();

    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', (err) => reject(err));
  });
}

export { generateCertificatePdf };
