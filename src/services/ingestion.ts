import mammoth from "mammoth";
// @ts-ignore
import pdfParse from "pdf-parse";
import JSZip from "jszip";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

interface IngestResult {
  pieceId: string;
  title: string;
  wordCount: number;
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * Extract title from filename or content
 */
function extractTitle(filename: string, content: string): string {
  // Try to get from first line if it looks like a title
  const firstLine = content.split("\n")[0].trim();
  if (firstLine && firstLine.length < 100 && firstLine.length > 3) {
    // Remove markdown heading markers
    const cleaned = firstLine.replace(/^#+\s*/, "");
    if (cleaned && !cleaned.includes("\n")) {
      return cleaned;
    }
  }

  // Fall back to filename without extension
  return filename.replace(/\.[^/.]+$/, "");
}

/**
 * Ingest plain text or markdown
 */
export async function ingestText(
  content: string,
  source: string
): Promise<IngestResult> {
  const prisma = await getPrisma();
  const title = extractTitle(source, content);
  const wordCount = countWords(content);

  const piece = await prisma.piece.create({
    data: {
      title,
      body: content,
      source,
      wordCount,
    },
  });

  return {
    pieceId: piece.id,
    title: piece.title,
    wordCount: piece.wordCount,
  };
}

/**
 * Ingest DOCX file
 */
export async function ingestDocx(
  buffer: Buffer,
  filename: string
): Promise<IngestResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const content = result.value;

    if (!content || content.trim().length === 0) {
      throw new Error("Could not extract text from DOCX");
    }

    return ingestText(content, filename);
  } catch (error: any) {
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
}

/**
 * Ingest PDF file
 */
export async function ingestPdf(
  buffer: Buffer,
  filename: string
): Promise<IngestResult> {
  try {
    const data = await pdfParse(buffer);
    const content = data.text;

    if (!content || content.trim().length === 0) {
      throw new Error("Could not extract text from PDF");
    }

    return ingestText(content, filename);
  } catch (error: any) {
    // Mark as needs manual review
    const prisma = await getPrisma();
    const piece = await prisma.piece.create({
      data: {
        title: filename,
        body: "[PDF text extraction failed - needs manual review]",
        source: filename,
        wordCount: 0,
        rawMetadataJson: JSON.stringify({ extraction_failed: true }),
      },
    });

    return {
      pieceId: piece.id,
      title: piece.title,
      wordCount: 0,
    };
  }
}

/**
 * Ingest ZIP file
 */
export async function ingestZip(
  buffer: Buffer,
  filename: string
): Promise<IngestResult[]> {
  const results: IngestResult[] = [];

  try {
    const zip = await JSZip.loadAsync(buffer);
    const files = Object.keys(zip.files);

    for (const filepath of files) {
      const file = zip.files[filepath];

      // Skip directories and hidden files
      if (file.dir || filepath.startsWith("__MACOSX")) {
        continue;
      }

      const ext = filepath.split(".").pop()?.toLowerCase();
      const content = await file.async("nodebuffer");

      try {
        let result: IngestResult;

        switch (ext) {
          case "txt":
          case "md":
            result = await ingestText(
              content.toString("utf-8"),
              `${filename}/${filepath}`
            );
            results.push(result);
            break;
          case "docx":
            result = await ingestDocx(content, `${filename}/${filepath}`);
            results.push(result);
            break;
          case "pdf":
            result = await ingestPdf(content, `${filename}/${filepath}`);
            results.push(result);
            break;
          default:
            console.warn(`Skipping unsupported file type: ${filepath}`);
        }
      } catch (error: any) {
        console.error(`Failed to ingest ${filepath}:`, error.message);
      }
    }
  } catch (error: any) {
    throw new Error(`Failed to parse ZIP: ${error.message}`);
  }

  return results;
}

/**
 * Main ingestion entry point
 */
export async function ingestFile(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<IngestResult[]> {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "txt":
    case "md":
      const text = buffer.toString("utf-8");
      return [await ingestText(text, filename)];

    case "docx":
      return [await ingestDocx(buffer, filename)];

    case "pdf":
      return [await ingestPdf(buffer, filename)];

    case "zip":
      return await ingestZip(buffer, filename);

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}
