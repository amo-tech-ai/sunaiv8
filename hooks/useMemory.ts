
import { useState, useCallback } from 'react';

export interface MemoryNode {
  id: string;
  content: string;
  tags: string[];
  timestamp: string;
  source: 'User' | 'System' | 'Agent';
}

/**
 * useMemory Hook
 * Simulates a client-side vector store for "Quiet AI" context.
 * In production, this would connect to Supabase pgvector.
 */
export function useMemory() {
  const [memoryBank, setMemoryBank] = useState<MemoryNode[]>([]);

  const addContext = useCallback((content: string, tags: string[] = [], source: MemoryNode['source'] = 'System') => {
    const newNode: MemoryNode = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      content,
      tags,
      timestamp: new Date().toISOString(),
      source
    };
    setMemoryBank(prev => [newNode, ...prev]);
  }, []);

  const retrieveContext = useCallback((query: string): string => {
    // Simple keyword matching simulation for RAG
    const keywords = query.toLowerCase().split(' ');
    const relevant = memoryBank.filter(node => 
      keywords.some(k => node.content.toLowerCase().includes(k)) ||
      keywords.some(k => node.tags.includes(k))
    );
    
    if (relevant.length === 0) return "";

    return relevant
      .slice(0, 5) // Top 5 chunks
      .map(n => `[${n.timestamp}] (${n.source}): ${n.content}`)
      .join('\n');
  }, [memoryBank]);

  const clearMemory = useCallback(() => {
    setMemoryBank([]);
  }, []);

  return { memoryBank, addContext, retrieveContext, clearMemory };
}
