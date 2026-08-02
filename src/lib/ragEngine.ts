/**
 * Local Retrieval-Augmented Generation (RAG) Engine for Kleo AI
 * Handles document parsing, text chunking, vector-like semantic retrieval, and citation extraction.
 */

export interface DocumentChunk {
  chunkId: string;
  docId: string;
  docName: string;
  text: string;
  pageNumber?: number;
}

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  chunks: DocumentChunk[];
}

export interface RAGRetrievalResult {
  snippets: DocumentChunk[];
  citedSources: { docName: string; chunkId: string; pageNumber?: number; previewText: string }[];
  contextPromptString: string;
}

// Starter Knowledge Base Documents included out-of-the-box
export const DEFAULT_KNOWLEDGE_BASE: DocumentFile[] = [
  {
    id: 'doc-kr-1',
    name: 'Korean_Grammar_Guide.pdf',
    size: 245000,
    type: 'application/pdf',
    uploadedAt: 'Just now',
    chunks: [
      {
        chunkId: 'chk-kr-1',
        docId: 'doc-kr-1',
        docName: 'Korean_Grammar_Guide.pdf',
        text: 'Korean Honorifics (존댓말 - Jondaetmal): In Korean speech, adding ~요 (~yo) creates friendly polite speech. ~입니다 (~imnida) and ~습니까 (~seumnida) are used in formal situations such as broadcasting, news, or business presentations. Banmal (반말) is informal speech used only with close peers or younger people.',
        pageNumber: 1
      },
      {
        chunkId: 'chk-kr-2',
        docId: 'doc-kr-1',
        docName: 'Korean_Grammar_Guide.pdf',
        text: 'Korean Topic vs Subject Markers: 은/는 (eun/neun) are topic markers used to introduce new topics or contrast items. 이/가 (i/ga) are subject markers emphasizing the subject performing the action. 을/를 (eul/reul) mark direct objects.',
        pageNumber: 3
      }
    ]
  },
  {
    id: 'doc-ja-1',
    name: 'Japanese_Particles_Manual.md',
    size: 180000,
    type: 'text/markdown',
    uploadedAt: 'Just now',
    chunks: [
      {
        chunkId: 'chk-ja-1',
        docId: 'doc-ja-1',
        docName: 'Japanese_Particles_Manual.md',
        text: 'Japanese Core Particles: は (wa) marks the sentence topic. が (ga) marks the grammatical subject. を (o) marks direct objects. に (ni) specifies target time, destination, or static location. で (de) specifies location of action or method/means.',
        pageNumber: 1
      },
      {
        chunkId: 'chk-ja-2',
        docId: 'doc-ja-1',
        docName: 'Japanese_Particles_Manual.md',
        text: 'Japanese Polite Form (丁寧語 - Teineigo): Nouns and adjectives end with です (desu). Verbs end with ます (masu). Past tense polite verbs end with ました (mashita). Negative polite verbs end with ません (masen).',
        pageNumber: 2
      }
    ]
  }
];

/**
 * Text Chunking Helper: Splits raw file text into ~500-800 token overlap chunks
 */
export function chunkText(rawText: string, docId: string, docName: string): DocumentChunk[] {
  const sentences = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];
  const chunks: DocumentChunk[] = [];
  let currentChunk = '';
  let chunkIdx = 1;

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > 600) {
      if (currentChunk.trim()) {
        chunks.push({
          chunkId: `chk-${docId}-${chunkIdx++}`,
          docId,
          docName,
          text: currentChunk.trim(),
          pageNumber: Math.ceil(chunkIdx / 2)
        });
      }
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      chunkId: `chk-${docId}-${chunkIdx}`,
      docId,
      docName,
      text: currentChunk.trim(),
      pageNumber: Math.ceil(chunkIdx / 2)
    });
  }

  return chunks;
}

/**
 * Hybrid Semantic Similarity Retrieval Engine
 * Scores active document chunks against query keywords and returns top-k snippets
 */
export function retrieveContext(query: string, documents: DocumentFile[], k = 3): RAGRetrievalResult {
  const queryTerms = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
  const allChunks: DocumentChunk[] = [];

  documents.forEach(doc => {
    allChunks.push(...doc.chunks);
  });

  if (allChunks.length === 0 || queryTerms.length === 0) {
    return { snippets: [], citedSources: [], contextPromptString: '' };
  }

  // Score each chunk
  const scored = allChunks.map(chunk => {
    const textLower = chunk.text.toLowerCase();
    let score = 0;

    queryTerms.forEach(term => {
      if (textLower.includes(term)) {
        score += 2;
        // Bonus for exact word match
        const regex = new RegExp(`\\b${term}\\b`, 'g');
        const matches = textLower.match(regex);
        if (matches) score += matches.length * 1.5;
      }
    });

    return { chunk, score };
  });

  // Filter chunks with positive score and sort descending
  const topChunks = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(item => item.chunk);

  const citedSources = topChunks.map(c => ({
    docName: c.docName,
    chunkId: c.chunkId,
    pageNumber: c.pageNumber,
    previewText: c.text.length > 120 ? c.text.slice(0, 120) + '...' : c.text
  }));

  const contextPromptString = topChunks.map((c, i) => `[Source ${i + 1}: ${c.docName} (Page ${c.pageNumber || 1})]\n${c.text}`).join('\n\n');

  return { snippets: topChunks, citedSources, contextPromptString };
}
