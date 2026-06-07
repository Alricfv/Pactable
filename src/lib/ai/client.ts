import { createClient } from '@/lib/supabaseClient';
import type { Contract, ContractCategory } from '@/lib/contracts/types';

type ContractStructure = Omit<Contract, 'id' | 'status' | 'parties'>;

export async function generateFullContract(prompt: string): Promise<ContractStructure> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/ai/generate-contract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.contract;
}

export async function generateSection(
  section: 'definitions' | 'articles',
  contractContext: {
    title: string;
    category: ContractCategory;
    definitions?: Contract['definitions'];
    articles?: Contract['articles'];
  },
  instruction?: string
): Promise<any> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/ai/generate-section', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ section, contractContext, instruction }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}
