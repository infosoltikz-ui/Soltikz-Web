import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak
} from 'docx';

export class DOCXGeneratorService {
  /**
   * Generates a native DOCX buffer from a Resume object.
   */
  public static async generateDOCX(resume: any): Promise<Buffer> {
    const { personal, summary, experiences, educations, skills, projects } = resume;

    const sections: any[] = [];
    const children: any[] = [];

    // Personal Info Header
    if (personal) {
      children.push(
        new Paragraph({
          text: `${personal.firstName || ''} ${personal.lastName || ''}`.trim(),
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: [
                personal.email,
                personal.phone,
                personal.city ? `${personal.city}, ${personal.state || ''}` : '',
                personal.linkedin
              ].filter(Boolean).join(' | '),
              size: 20 // 10pt
            })
          ],
          spacing: { after: 400 }
        })
      );
    }

    // Professional Summary
    if (summary?.content) {
      children.push(
        new Paragraph({
          text: 'Professional Summary',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: summary.content,
          spacing: { after: 200 }
        })
      );
    }

    // Experience
    if (experiences && experiences.length > 0) {
      children.push(
        new Paragraph({
          text: 'Experience',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        })
      );

      experiences.forEach((exp: any) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${exp.jobTitle} at ${exp.companyName}`, bold: true }),
            ],
            spacing: { before: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : (exp.endDate || '')}`, italics: true }),
              new TextRun({ text: ` | ${exp.city || ''} ${exp.state || ''}`, italics: true }),
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: exp.description || '',
            spacing: { after: 200 }
          })
        );
      });
    }

    // Education
    if (educations && educations.length > 0) {
      children.push(
        new Paragraph({
          text: 'Education',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        })
      );

      educations.forEach((edu: any) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree ? `${edu.degree} in ` : ''}${edu.fieldOfStudy || ''}`, bold: true }),
            ],
            spacing: { before: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.institution}`, bold: true }),
              new TextRun({ text: ` | ${edu.startDate || ''} - ${edu.currentlyStudying ? 'Present' : (edu.endDate || '')}`, italics: true }),
            ],
            spacing: { after: 100 }
          })
        );
      });
    }

    // Skills
    if (skills && skills.length > 0) {
      children.push(
        new Paragraph({
          text: 'Skills',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 100 }
        }),
        new Paragraph({
          text: skills.map((s: any) => s.name).join(', ')
        })
      );
    }

    sections.push({
      properties: {},
      children
    });

    const doc = new Document({
      sections
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer as Buffer;
  }
}
