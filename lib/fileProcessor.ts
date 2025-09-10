// File processing utilities for extracting text from various file formats
// This runs on the server side only

export interface ProcessedFile {
  name: string;
  text: string;
  type: string;
}

export async function processFile(file: File): Promise<ProcessedFile> {
  const fileName = file.name;
  const fileType = file.type;
  
  try {
    let text = '';
    
    if (fileType === 'application/pdf') {
      // Process PDF files using pdf-parse with workaround
      try {
        console.log('Processing PDF file:', fileName);
        const arrayBuffer = await file.arrayBuffer();
        console.log('ArrayBuffer size:', arrayBuffer.byteLength);
        
        // Create a temporary directory for pdf-parse to work
        const fs = await import('fs');
        const path = await import('path');
        const os = await import('os');
        
        const tempDir = path.join(os.tmpdir(), 'pdf-parse-temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Create a temporary file
        const tempFilePath = path.join(tempDir, `temp-${Date.now()}.pdf`);
        fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));
        
        // Use pdf-parse with the temporary file
        const pdf = await import('pdf-parse');
        const pdfData = await pdf.default(fs.readFileSync(tempFilePath));
        
        // Clean up temporary file
        fs.unlinkSync(tempFilePath);
        
        text = pdfData.text;
        console.log('PDF text extracted, length:', text.length);
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        throw new Error(`Failed to process PDF file: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`);
      }
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileType === 'application/msword') {
      // Process DOCX/DOC files
      try {
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } catch (docxError) {
        console.error('DOCX processing error:', docxError);
        throw new Error('Failed to process Word document. Please ensure it\'s a valid DOCX/DOC file.');
      }
    } else if (fileType === 'text/plain') {
      // Process TXT files
      text = await file.text();
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    return {
      name: fileName,
      text: text.trim(),
      type: fileType
    };
  } catch (error) {
    console.error('File processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`${errorMessage}`);
  }
}

export function getFileIcon(fileType: string): string {
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType === 'text/plain') return '📃';
  return '📎';
}
