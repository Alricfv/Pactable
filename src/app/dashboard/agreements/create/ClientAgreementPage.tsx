'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { Trash2, PlusCircle, Download, ChevronDown, ChevronUp, FileText, Shield, Home, Banknote, Users, Building2, User, Check, AlertCircle, Pencil } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useSessionContext } from '@/contexts/SessionContext';

import {
  type Contract,
  type ContractParty,
  type ContractClause,
  type ContractTemplate,
  type PartyRole,
  type ClauseTerm,
  contractTemplates,
  createContractFromTemplate,
  generateContractText,
  PARTY_ROLE_LABELS,
  CONTRACT_CATEGORY_LABELS,
} from '@/lib/contracts';

type EditorTab = 'parties' | 'definitions' | 'terms' | 'review' | 'summary';

// Template Card
function TemplateCard({ template, isSelected, onSelect }: { template: ContractTemplate; isSelected: boolean; onSelect: () => void }) {
  const getIcon = () => {
    switch (template.category) {
      case 'nda': return <Shield className="w-8 h-8" />;
      case 'service_agreement': return <FileText className="w-8 h-8" />;
      case 'rental': return <Home className="w-8 h-8" />;
      case 'loan': return <Banknote className="w-8 h-8" />;
      case 'general': return <Pencil className="w-8 h-8" />;
      default: return <FileText className="w-8 h-8" />;
    }
  };

  const isCustom = template.id === 'custom_agreement';

  return (
    <button
      onClick={onSelect}
      className={`relative p-6 border-2 rounded-xl text-left transition-all ${
        isCustom ? 'bg-orange-50' : 'bg-white'
      } ${
        isSelected ? 'border-orange-500 shadow-md' : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`mb-3 ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>{getIcon()}</div>
      <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
      <div className="mt-3">
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
          {CONTRACT_CATEGORY_LABELS[template.category]}
        </span>
      </div>
    </button>
  );
}

// Party Editor
function PartyEditor({ parties, defaultRoles, onChange }: { 
  parties: ContractParty[]; 
  defaultRoles: PartyRole[]; 
  onChange: (parties: ContractParty[]) => void;
}) {
  const addParty = (role: PartyRole) => {
    const newParty: ContractParty = {
      id: `party-${Date.now()}`,
      role,
      type: 'individual',
      name: '',
      email: '',
      address: { street: '', city: '', state: '', postalCode: '', country: 'United States' },
    };
    onChange([...parties, newParty]);
  };

  const updateParty = (index: number, updates: Partial<ContractParty>) => {
    const newParties = [...parties];
    newParties[index] = { ...newParties[index], ...updates };
    onChange(newParties);
  };

  const removeParty = (index: number) => {
    onChange(parties.filter((_, i) => i !== index));
  };

  const getPartiesForRole = (role: PartyRole) => {
    return parties.map((p, i) => ({ party: p, index: i })).filter(({ party }) => party.role === role);
  };

  return (
    <div className="space-y-6">
      {defaultRoles.map((role) => {
        const roleParties = getPartiesForRole(role);
        return (
          <div key={role} className="bg-gray-50 rounded-lg p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-gray-400" />
                {PARTY_ROLE_LABELS[role]}
              </h4>
              <button onClick={() => addParty(role)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                <PlusCircle size={16} />
                Add {PARTY_ROLE_LABELS[role]}
              </button>
            </div>

            {roleParties.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No {PARTY_ROLE_LABELS[role].toLowerCase()} added yet</p>
            ) : (
              <div className="space-y-4">
                {roleParties.map(({ party, index }) => (
                  <div key={party.id} className="bg-white rounded-lg border border-gray-300 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateParty(index, { type: 'individual' })}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                            party.type === 'individual' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <User size={14} />
                          Individual
                        </button>
                        <button
                          onClick={() => updateParty(index, { type: 'company' })}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                            party.type === 'company' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Building2 size={14} />
                          Company
                        </button>
                      </div>
                      <button onClick={() => removeParty(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {party.type === 'company' ? 'Company Name' : 'Full Name'}
                        </label>
                        <input
                          type="text"
                          value={party.type === 'company' ? (party.companyName || '') : party.name}
                          onChange={(e) => updateParty(index, party.type === 'company' ? { companyName: e.target.value, name: e.target.value } : { name: e.target.value })}
                          placeholder={party.type === 'company' ? 'Acme Corporation' : 'John Doe'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <input
                          type="email"
                          value={party.email}
                          onChange={(e) => updateParty(index, { email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      {party.type === 'company' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Representative Name</label>
                          <input
                            type="text"
                            value={party.representativeName || ''}
                            onChange={(e) => updateParty(index, { representativeName: e.target.value })}
                            placeholder="Jane Smith"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      )}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Street Address</label>
                        <input
                          type="text"
                          value={party.address?.street || ''}
                          onChange={(e) => updateParty(index, { address: { ...party.address, street: e.target.value } })}
                          placeholder="123 Main Street"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                        <input
                          type="text"
                          value={party.address?.city || ''}
                          onChange={(e) => updateParty(index, { address: { ...party.address, city: e.target.value } })}
                          placeholder="New York"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                        <input
                          type="text"
                          value={party.address?.state || ''}
                          onChange={(e) => updateParty(index, { address: { ...party.address, state: e.target.value } })}
                          placeholder="NY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={party.address?.postalCode || ''}
                          onChange={(e) => updateParty(index, { address: { ...party.address, postalCode: e.target.value } })}
                          placeholder="10001"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                        <input
                          type="text"
                          value={party.address?.country || ''}
                          onChange={(e) => updateParty(index, { address: { ...party.address, country: e.target.value } })}
                          placeholder="United States"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Definitions Editor
function DefinitionsEditor({ definitions, onChange }: { 
  definitions: Contract['definitions']; 
  onChange: (definitions: Contract['definitions']) => void;
}) {
  const addDefinition = () => {
    onChange({
      ...definitions,
      terms: [...definitions.terms, { term: '', definition: '' }]
    });
  };

  const updateTerm = (index: number, field: 'term' | 'definition', value: string) => {
    const newTerms = [...definitions.terms];
    newTerms[index] = { ...newTerms[index], [field]: value };
    onChange({ ...definitions, terms: newTerms });
  };

  const removeTerm = (index: number) => {
    onChange({ ...definitions, terms: definitions.terms.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Contract Definitions</h4>
        <button onClick={addDefinition} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
          <PlusCircle size={16} />
          Add Definition
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={definitions.enabled}
          onChange={(e) => onChange({ ...definitions, enabled: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label className="text-sm text-gray-700">Include definitions section</label>
      </div>

      {definitions.enabled && (
        definitions.terms.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No definitions added yet</p>
        ) : (
          <div className="space-y-3">
            {definitions.terms.map((def, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={def.term}
                    onChange={(e) => updateTerm(index, 'term', e.target.value)}
                    placeholder="Term"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium"
                  />
                </div>
                <div className="flex-[2]">
                  <textarea
                    value={def.definition}
                    onChange={(e) => updateTerm(index, 'definition', e.target.value)}
                    placeholder="Definition..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <button onClick={() => removeTerm(index)} className="mt-2 text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// Articles Editor (simplified for terms editing)
function ArticlesEditor({ articles, onChange, allowAddArticle = false }: { 
  articles: Contract['articles']; 
  onChange: (articles: Contract['articles']) => void;
  allowAddArticle?: boolean;
}) {
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set([0]));

  const toggleArticle = (index: number) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedArticles(newExpanded);
  };

  const addArticle = () => {
    const newArticleNumber = String(articles.length + 1);
    const newArticle = {
      id: `article-${Date.now()}`,
      number: newArticleNumber,
      title: '',
      clauses: [
        {
          id: `clause-${Date.now()}`,
          number: `${newArticleNumber}.1`,
          type: 'standard' as const,
          title: '',
          terms: [{ id: `term-${Date.now()}`, text: '', isEditable: true }],
          isRequired: false,
          isEditable: true,
        }
      ]
    };
    const newExpanded = new Set(expandedArticles);
    newExpanded.add(articles.length);
    setExpandedArticles(newExpanded);
    onChange([...articles, newArticle]);
  };

  const removeArticle = (index: number) => {
    const newArticles = articles.filter((_, i) => i !== index);
    // Renumber articles
    newArticles.forEach((article, i) => {
      article.number = String(i + 1);
      article.clauses.forEach((clause, j) => {
        clause.number = `${i + 1}.${j + 1}`;
      });
    });
    onChange(newArticles);
  };

  const updateArticleTitle = (index: number, title: string) => {
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], title };
    onChange(newArticles);
  };

  const updateClauseTitle = (articleIndex: number, clauseIndex: number, title: string) => {
    const newArticles = [...articles];
    const newClauses = [...newArticles[articleIndex].clauses];
    newClauses[clauseIndex] = { ...newClauses[clauseIndex], title };
    newArticles[articleIndex] = { ...newArticles[articleIndex], clauses: newClauses };
    onChange(newArticles);
  };

  const updateClauseTerm = (articleIndex: number, clauseIndex: number, termIndex: number, text: string) => {
    const newArticles = [...articles];
    const newClauses = [...newArticles[articleIndex].clauses];
    const newTerms = [...newClauses[clauseIndex].terms];
    newTerms[termIndex] = { ...newTerms[termIndex], text };
    newClauses[clauseIndex] = { ...newClauses[clauseIndex], terms: newTerms };
    newArticles[articleIndex] = { ...newArticles[articleIndex], clauses: newClauses };
    onChange(newArticles);
  };

  const addClause = (articleIndex: number) => {
    const article = articles[articleIndex];
    const newClause: ContractClause = {
      id: `clause-${Date.now()}`,
      number: `${article.number}.${article.clauses.length + 1}`,
      type: 'standard',
      title: '',
      terms: [{ id: `term-${Date.now()}`, text: '', isEditable: true }],
      isRequired: false,
      isEditable: true,
    };
    const newArticles = [...articles];
    newArticles[articleIndex] = { ...article, clauses: [...article.clauses, newClause] };
    onChange(newArticles);
  };

  const removeClause = (articleIndex: number, clauseIndex: number) => {
    const newArticles = [...articles];
    const newClauses = newArticles[articleIndex].clauses.filter((_, i) => i !== clauseIndex);
    // Renumber
    newClauses.forEach((c, i) => { c.number = `${newArticles[articleIndex].number}.${i + 1}`; });
    newArticles[articleIndex] = { ...newArticles[articleIndex], clauses: newClauses };
    onChange(newArticles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Contract Articles & Clauses</h4>
        {allowAddArticle && (
          <button onClick={addArticle} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
            <PlusCircle size={16} />
            Add Article
          </button>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-400 mb-3">No articles defined yet</p>
          {allowAddArticle && (
            <button onClick={addArticle} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
              <PlusCircle size={16} />
              Add your first article
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article, articleIndex) => (
            <div key={article.id} className="border border-gray-300 rounded-lg overflow-hidden">
              <div
                className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer border-b border-gray-300"
                onClick={() => toggleArticle(articleIndex)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">ARTICLE {article.number}</span>
                  <input
                    type="text"
                    value={article.title}
                    onChange={(e) => { e.stopPropagation(); updateArticleTitle(articleIndex, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Article title"
                    className="px-2 py-1 border border-gray-300 rounded text-sm font-medium"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{article.clauses.length} clauses</span>
                  {allowAddArticle && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeArticle(articleIndex); }} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {expandedArticles.has(articleIndex) ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </div>

              {expandedArticles.has(articleIndex) && (
                <div className="p-4 space-y-3 bg-gray-50">
                  {article.clauses.map((clause, clauseIndex) => (
                    <div key={clause.id} className="border border-gray-300 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Clause {clause.number}</span>
                        <button onClick={() => removeClause(articleIndex, clauseIndex)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={clause.title}
                        onChange={(e) => updateClauseTitle(articleIndex, clauseIndex, e.target.value)}
                        placeholder="Clause title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium mb-2"
                      />

                      {clause.terms.map((term, termIndex) => (
                        <textarea
                          key={term.id}
                          value={term.text}
                          onChange={(e) => updateClauseTerm(articleIndex, clauseIndex, termIndex, e.target.value)}
                          placeholder="Clause text..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                          disabled={!term.isEditable}
                        />
                      ))}
                    </div>
                  ))}

                  <button
                    onClick={() => addClause(articleIndex)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={16} />
                    Add Clause
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Contract Preview (used in Review tab — full text)
function ContractPreview({ contract }: { contract: Contract }) {
  const contractText = generateContractText(contract);
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8 max-h-[600px] overflow-y-auto">
      <div className="prose prose-sm max-w-none whitespace-pre-wrap font-serif">{contractText}</div>
    </div>
  );
}

// Live PDF-style Preview with section highlighting
function LiveContractPreview({ contract, activeTab }: { contract: Contract; activeTab: EditorTab }) {
  const highlight = (section: EditorTab) =>
    activeTab === section
      ? 'bg-orange-50 border-l-4 border-orange-400 pl-4 py-2 rounded-r-md transition-all duration-300'
      : 'pl-5 py-2 opacity-60 transition-all duration-300';

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col h-[calc(100vh-220px)] sticky top-[180px]">
      {/* Paper header */}
      <div className="px-6 py-3 border-b border-gray-300 flex items-center justify-between bg-gray-50 rounded-t-xl">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Live Preview</span>
        <span className="text-xs text-gray-400">PDF</span>
      </div>

      {/* Scrollable document body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 font-serif text-[13px] leading-relaxed text-gray-800">
        {/* Title */}
        <h1 className="text-center font-bold text-base mb-1 tracking-wide uppercase">
          {contract.title || 'Untitled Contract'}
        </h1>
        {contract.preamble.date && (
          <p className="text-center text-xs text-gray-400 mb-4">
            Date: {contract.preamble.date}
          </p>
        )}

        <hr className="my-4 border-gray-200" />

        {/* Preamble */}
        <div className={highlight('parties')}>
          <p className="text-[12px]">{contract.preamble.introText}</p>
        </div>

        {/* Parties */}
        <div className={highlight('parties')}>
          <h2 className="font-bold text-[13px] uppercase mt-4 mb-2">Parties</h2>
          {contract.parties.length === 0 ? (
            <p className="text-gray-300 italic text-[12px]">No parties added yet...</p>
          ) : (
            contract.parties.map((party, i) => (
              <div key={party.id} className="mb-2">
                <p className="text-[12px]">
                  <span className="font-semibold">{i + 1}.</span>{' '}
                  {party.name || <span className="text-gray-300">[Name]</span>}
                  {party.type === 'company' && party.companyName && ` (${party.companyName})`}
                  {party.email && <span className="text-gray-400"> — {party.email}</span>}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Recitals */}
        {contract.recitals.enabled && contract.recitals.items.length > 0 && (
          <div className="pl-5 py-2 opacity-80">
            <h2 className="font-bold text-[13px] uppercase mt-4 mb-2">Recitals</h2>
            {contract.recitals.items.map((item, i) => (
              <p key={i} className="text-[12px] mb-1">
                {String.fromCharCode(65 + i)}. {item}
              </p>
            ))}
          </div>
        )}

        {/* Definitions */}
        {contract.definitions.enabled && contract.definitions.terms.length > 0 && (
          <div className={highlight('definitions')}>
            <h2 className="font-bold text-[13px] uppercase mt-4 mb-2">Definitions</h2>
            {contract.definitions.terms.map((def, i) => (
              <p key={i} className="text-[12px] mb-1">
                <span className="font-semibold">&quot;{def.term || '...'}&quot;</span>{' '}
                {def.definition || <span className="text-gray-300">[definition]</span>}
              </p>
            ))}
          </div>
        )}

        {/* Articles / Terms */}
        {contract.articles.length === 0 ? (
          <div className={highlight('terms')}>
            <p className="text-gray-300 italic text-[12px] mt-4">No articles defined yet...</p>
          </div>
        ) : (
          contract.articles.map((article) => (
            <div key={article.id} className={highlight('terms')}>
              <h2 className="font-bold text-[13px] uppercase mt-4 mb-2">
                Article {article.number}: {article.title || '...'}
              </h2>
              {article.clauses.map((clause) => (
                <div key={clause.id} className="mb-2">
                  <p className="font-semibold text-[12px]">
                    {clause.number} {clause.title}
                  </p>
                  {clause.terms.map((term) => (
                    <p key={term.id} className="text-[12px] ml-4">
                      {term.text || <span className="text-gray-300">[clause text]</span>}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}

        {/* Signature block */}
        <div className={highlight('summary')}>
          <hr className="my-4 border-gray-200" />
          <h2 className="font-bold text-[13px] uppercase mb-3">Signatures</h2>
          {contract.parties.length === 0 ? (
            <p className="text-gray-300 italic text-[12px]">No signature lines yet...</p>
          ) : (
            contract.parties.map((party) => (
              <div key={party.id} className="mb-4">
                <p className="text-[11px] font-semibold uppercase text-gray-500">
                  {PARTY_ROLE_LABELS[party.role]}
                </p>
                <div className="mt-2 border-b border-gray-300 w-48" />
                <p className="text-[11px] mt-1">{party.name || '________________________'}</p>
                <p className="text-[11px] text-gray-400">Date: ________________________</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Validation Summary
function ValidationSummary({ contract, template }: { contract: Contract; template: ContractTemplate }) {
  const issues: string[] = [];

  for (const role of template.defaultPartyRoles) {
    const hasRole = contract.parties.some((p) => p.role === role && p.name.trim());
    if (!hasRole) {
      issues.push(`Missing ${PARTY_ROLE_LABELS[role]} party`);
    }
  }

  if (contract.articles.length === 0) {
    issues.push('No articles defined');
  } else {
    contract.articles.forEach((article, i) => {
      if (!article.title.trim()) issues.push(`Article ${i + 1} has no title`);
    });
  }

  const isValid = issues.length === 0;

  return (
    <div className={`rounded-lg p-4 ${isValid ? 'bg-green-50 border border-green-300' : 'bg-yellow-50 border border-yellow-300'}`}>
      <div className="flex items-start gap-3">
        {isValid ? <Check className="w-5 h-5 text-green-600 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />}
        <div>
          <h4 className={`font-medium ${isValid ? 'text-green-800' : 'text-yellow-800'}`}>
            {isValid ? 'Contract Ready' : 'Issues Found'}
          </h4>
          {isValid ? (
            <p className="text-sm text-green-700 mt-1">Your contract is complete and ready to be created.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {issues.map((issue, i) => (<li key={i} className="text-sm text-yellow-700">• {issue}</li>))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Check if we have a cached session in localStorage
function hasCachedSession(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const cached = localStorage.getItem('pactable_session_cache')
    if (!cached) return false
    const { session, timestamp } = JSON.parse(cached)
    return session && (Date.now() - timestamp < 60 * 60 * 1000)
  } catch {
    return false
  }
}

// Main Component
export default function ClientAgreementPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, loading } = useSessionContext();

  const [step, setStep] = useState<'select' | 'edit'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('parties');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth guard - show loading while checking
  if (loading || (!user && hasCachedSession())) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Only redirect if no user AND no cached session
  if (!user && !hasCachedSession()) {
    router.replace('/signin');
    return null;
  }

  // If we have cached session but no user yet, keep showing loading
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const selectTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    const newContract = createContractFromTemplate(template, []);
    setContract(newContract);
    setStep('edit');
  };

  const updateTitle = (title: string) => {
    if (!contract) return;
    setContract({ ...contract, title });
  };

  const updateParties = (parties: ContractParty[]) => {
    if (!contract) return;
    setContract({ ...contract, parties });
  };

  const updateDefinitions = (definitions: Contract['definitions']) => {
    if (!contract) return;
    setContract({ ...contract, definitions });
  };

  const updateArticles = (articles: Contract['articles']) => {
    if (!contract) return;
    setContract({ ...contract, articles });
  };

  const generatePDF = async (): Promise<Uint8Array> => {
    if (!contract) throw new Error('No contract');

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 72;
    const lineHeight = 14;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const addText = (text: string, options: { bold?: boolean; size?: number; indent?: number } = {}) => {
      const { bold = false, size = 11, indent = 0 } = options;
      const usedFont = bold ? boldFont : font;
      const maxWidth = pageWidth - margin * 2 - indent;

      const words = text.split(' ');
      let line = '';

      for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const width = usedFont.widthOfTextAtSize(testLine, size);

        if (width > maxWidth && line) {
          if (y < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          page.drawText(line, { x: margin + indent, y, size, font: usedFont, color: rgb(0, 0, 0) });
          y -= lineHeight;
          line = word;
        } else {
          line = testLine;
        }
      }

      if (line) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, { x: margin + indent, y, size, font: usedFont, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }
    };

    const addSpace = (lines = 1) => {
      y -= lineHeight * lines;
      if (y < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
    };

    addText(contract.title, { bold: true, size: 16 });
    addSpace(2);

    addText(contract.preamble.introText);
    addSpace();

    for (const article of contract.articles) {
      addText(`ARTICLE ${article.number}: ${article.title.toUpperCase()}`, { bold: true, size: 12 });
      addSpace();

      for (const clause of article.clauses) {
        addText(`${clause.number} ${clause.title}`, { bold: true, indent: 20 });
        for (const term of clause.terms) {
          addText(term.text, { indent: 20 });
        }
        addSpace(0.5);
      }
      addSpace();
    }

    addText('IN WITNESS WHEREOF', { bold: true, size: 12 });
    addSpace();
    addText('The parties have executed this Agreement as of the date first written above.');
    addSpace(3);

    for (const party of contract.parties) {
      addText(`${PARTY_ROLE_LABELS[party.role].toUpperCase()}:`, { bold: true });
      addSpace(2);
      addText('_________________________________');
      addText(`Name: ${party.name || '________________________'}`);
      addText('Date: ________________________');
      addSpace(2);
    }

    return pdfDoc.save();
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBytes = await generatePDF();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contract?.title || 'contract'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setError('Failed to generate PDF');
    }
  };

  const handleSave = async () => {
    if (!contract || !selectedTemplate) return;
    if (!user) {
      setError('Not authenticated');
      return;
    }

    // Validate that at least 2 parties are added
    if (contract.parties.length < 2) {
      setError('Please add at least 2 parties to the agreement before saving.');
      return;
    }

    // Validate that all parties have names
    const partiesWithoutNames = contract.parties.filter(p => !p.name?.trim());
    if (partiesWithoutNames.length > 0) {
      setError('All parties must have a name before saving.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Save the full contract object as JSON for proper rendering in view page
      const contractJson = JSON.stringify(contract);

      const { data: agreement, error: agreementError } = await supabase
        .from('agreements')
        .insert({
          title: contract.title,
          content: contractJson,
          created_by: user.id,
        })
        .select()
        .single();

      if (agreementError) throw agreementError;

      // Add the creator as a participant
      const { error: participantsError } = await supabase
        .from('agreement_participants')
        .insert({
          agreement_id: agreement.id,
          user_id: user.id,
          role: 'creator',
          status: 'Signed',
        });

      if (participantsError) console.warn('Failed to save participant:', participantsError);

      // Add other contract parties as participants by their emails
      const otherPartyEmails = contract.parties
        .map(p => p.email?.trim().toLowerCase())
        .filter((email): email is string => !!email && email !== user.email?.toLowerCase());

      if (otherPartyEmails.length > 0) {
        const { error: addParticipantsError } = await supabase.rpc('add_participants_to_agreement', {
          p_agreement_id: agreement.id,
          participant_emails: otherPartyEmails,
        });
        if (addParticipantsError) console.warn('Failed to add participants:', addParticipantsError);
      }

      router.push(`/dashboard/agreements/view/${agreement.id}`);
    } catch (err) {
      console.error('Failed to save contract:', err);
      setError(err instanceof Error ? err.message : 'Failed to save contract');
    } finally {
      setIsSaving(false);
    }
  };

  if (step === 'select') {
    // Separate custom template from the rest
    const standardTemplates = contractTemplates.filter(t => t.id !== 'custom_agreement');
    const customTemplate = contractTemplates.find(t => t.id === 'custom_agreement');

    return (
      <div className="min-h-screen bg-white py-8 pt-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create New Contract</h1>
            <p className="text-gray-600 mt-1">Choose a template to get started</p>
          </div>

          {/* Standard Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {standardTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onSelect={() => selectTemplate(template)}
              />
            ))}
          </div>

          {/* OR Divider */}
          <div className="flex items-center my-10">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-6 text-gray-400 font-medium text-lg">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Custom Template - Full Width */}
          {customTemplate && (
            <button
              onClick={() => selectTemplate(customTemplate)}
              className={`w-full p-6 border-2 rounded-xl text-left transition-all bg-orange-50 hover:bg-orange-100 flex items-center gap-6 ${
                selectedTemplate?.id === customTemplate.id 
                  ? 'border-orange-500 shadow-md' 
                  : 'border-orange-200 hover:border-orange-400'
              }`}
            >
              <div className="flex-shrink-0 w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <Pencil className="w-7 h-7 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{customTemplate.name}</h3>
                <p className="text-gray-600 mt-1">{customTemplate.description}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg">
                  Start from scratch →
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!contract || !selectedTemplate) return null;

  const tabs: { id: EditorTab; label: string }[] = [
    { id: 'parties', label: 'Parties' },
    { id: 'definitions', label: 'Definitions' },
    { id: 'terms', label: 'Terms' },
    { id: 'review', label: 'Review' },
    { id: 'summary', label: 'Summary' },
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="bg-white border-b border-gray-300 sticky top-[72px] z-10">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => setStep('select')} className="text-sm text-gray-500 hover:text-gray-700 mb-1">
                ← Back to templates
              </button>
              {selectedTemplate.options.allowCustomClauses ? (
                <input
                  type="text"
                  value={contract.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  placeholder="Enter contract title..."
                  className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none transition-colors w-full max-w-md"
                />
              ) : (
                <h1 className="text-xl font-bold text-gray-900">{contract.title}</h1>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Contract'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-300">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        <div className="flex gap-6">
          {/* Left: Editor Panel */}
          <div className="flex-1 min-w-0">
            {activeTab === 'parties' && (
              <PartyEditor parties={contract.parties} defaultRoles={selectedTemplate.defaultPartyRoles} onChange={updateParties} />
            )}

            {activeTab === 'definitions' && <DefinitionsEditor definitions={contract.definitions} onChange={updateDefinitions} />}

            {activeTab === 'terms' && (
              <ArticlesEditor 
                articles={contract.articles} 
                onChange={updateArticles} 
                allowAddArticle={selectedTemplate.options.allowCustomClauses}
              />
            )}

            {activeTab === 'review' && <ContractPreview contract={contract} />}

            {activeTab === 'summary' && <ValidationSummary contract={contract} template={selectedTemplate} />}
          </div>

          {/* Right: Live Preview Panel */}
          <div className="hidden lg:block w-[380px] flex-shrink-0">
            <LiveContractPreview contract={contract} activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
