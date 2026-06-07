import { useState, useCallback } from 'react';
import { generateFullContract, generateSection } from '@/lib/ai/client';
import type { Contract, ContractCategory } from '@/lib/contracts/types';

export function useAIContractGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateFullContract(prompt);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generate, isGenerating, error, clearError: () => setError(null) };
}

export function useAISectionGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDefinitions = useCallback(async (context: {
    title: string;
    category: ContractCategory;
    articles?: Contract['articles'];
  }) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateSection('definitions', context);
      return result.definitions || result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateArticles = useCallback(async (context: {
    title: string;
    category: ContractCategory;
    definitions?: Contract['definitions'];
    articles?: Contract['articles'];
  }, instruction?: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateSection('articles', context, instruction);
      return result.articles || result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateDefinitions, generateArticles, isGenerating, error, clearError: () => setError(null) };
}
