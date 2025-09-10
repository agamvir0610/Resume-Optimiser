import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { ExportData, OptimizationResult } from './schema';

export async function generateDocxBuffer(
  result: OptimizationResult, 
  userData: { name: string; email: string; phone?: string }
): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header
        new Paragraph({
          children: [
            new TextRun({
              text: userData.name,
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: userData.email,
              size: 24,
            }),
            ...(userData.phone ? [
              new TextRun({
                text: ` • ${userData.phone}`,
                size: 24,
              })
            ] : []),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Professional Summary
        new Paragraph({
          children: [
            new TextRun({
              text: 'PROFESSIONAL SUMMARY',
              bold: true,
              size: 28,
              allCaps: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: result.professional_summary,
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        }),

        // Core Skills & Tools (ATS Keywords)
        new Paragraph({
          children: [
            new TextRun({
              text: 'CORE SKILLS & TOOLS',
              bold: true,
              size: 28,
              allCaps: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: result.ats_keywords.join(' • '),
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        }),

        // Professional Experience
        new Paragraph({
          children: [
            new TextRun({
              text: 'PROFESSIONAL EXPERIENCE',
              bold: true,
              size: 28,
              allCaps: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),

        // Rewritten Bullets
        ...result.rewritten_bullets.map(bullet => 
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${bullet}`,
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          })
        ),

        // Cover Letter
        new Paragraph({
          children: [
            new TextRun({
              text: 'COVER LETTER',
              bold: true,
              size: 28,
              allCaps: true,
            }),
          ],
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: result.cover_letter,
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        }),
      ],
    }],
  });

  return await Packer.toBuffer(doc);
}

export async function generatePdfBuffer(
  result: OptimizationResult, 
  userData: { name: string; email: string; phone?: string }
): Promise<Buffer> {
  // For PDF generation, we'll create a simple text-based version
  // In production, you'd use a library like puppeteer or playwright
  const content = `
${userData.name}
${userData.email}${userData.phone ? ` • ${userData.phone}` : ''}

PROFESSIONAL SUMMARY
${result.professional_summary}

CORE SKILLS & TOOLS
${result.ats_keywords.join(' • ')}

PROFESSIONAL EXPERIENCE
${result.rewritten_bullets.map(bullet => `• ${bullet}`).join('\n')}

COVER LETTER
${result.cover_letter}
`;

  return Buffer.from(content, 'utf-8');
}


