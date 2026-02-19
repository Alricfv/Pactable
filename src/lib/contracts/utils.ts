/**
 * Contract Utilities
 * 
 * Helper functions for working with contracts:
 * - Generating contract text from structure
 * - Formatting clauses and articles
 * - Creating boilerplate text
 */

import type { 
  Contract, 
  ContractClause, 
  ContractParty,
  PartyRole 
} from './types';
import { PARTY_ROLE_LABELS, formatContractDate } from './types';

// ============================================================================
// PARTY FORMATTING
// ============================================================================

export function formatPartyName(party: ContractParty): string {
  if (party.type === 'company' && party.companyName) {
    return party.companyName;
  }
  return party.name;
}

export function formatPartyFullDescription(party: ContractParty): string {
  const roleLabel = PARTY_ROLE_LABELS[party.role] || party.role;
  
  if (party.type === 'company' && party.companyName) {
    let desc = `${party.companyName}`;
    if (party.registrationNumber) {
      desc += ` (Registration No. ${party.registrationNumber})`;
    }
    if (party.representativeName) {
      desc += `, represented by ${party.representativeName}`;
      if (party.representativeTitle) {
        desc += `, ${party.representativeTitle}`;
      }
    }
    return `${desc} (hereinafter referred to as the "${roleLabel}")`;
  }
  
  let desc = party.name;
  if (party.address) {
    const addr = party.address;
    const parts = [addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean);
    if (parts.length > 0) {
      desc += `, residing at ${parts.join(', ')}`;
    }
  }
  return `${desc} (hereinafter referred to as the "${roleLabel}")`;
}

// ============================================================================
// CONTRACT TEXT GENERATION
// ============================================================================

export function generateContractText(contract: Contract): string {
  const lines: string[] = [];
  
  // Title
  lines.push(contract.title.toUpperCase());
  lines.push('');
  
  // Preamble
  if (contract.preamble.date) {
    lines.push(`Date: ${formatContractDate(contract.preamble.date)}`);
    lines.push('');
  }
  lines.push(contract.preamble.introText);
  lines.push('');
  
  // Parties
  lines.push('PARTIES:');
  lines.push('');
  contract.parties.forEach((party, index) => {
    lines.push(`${index + 1}. ${formatPartyFullDescription(party)}`);
    if (party.email) {
      lines.push(`   Email: ${party.email}`);
    }
    lines.push('');
  });
  
  // Recitals
  if (contract.recitals.enabled && contract.recitals.items.length > 0) {
    lines.push(contract.recitals.introText.toUpperCase());
    lines.push('');
    contract.recitals.items.forEach((item, index) => {
      lines.push(`${String.fromCharCode(65 + index)}. ${item}`);
    });
    lines.push('');
    lines.push('NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:');
    lines.push('');
  }
  
  // Definitions
  if (contract.definitions.enabled && contract.definitions.terms.length > 0) {
    lines.push('DEFINITIONS');
    lines.push('');
    contract.definitions.terms.forEach(def => {
      lines.push(`"${def.term}" ${def.definition}`);
      lines.push('');
    });
  }
  
  // Articles
  contract.articles.forEach(article => {
    lines.push(`ARTICLE ${article.number}: ${article.title.toUpperCase()}`);
    lines.push('');
    
    article.clauses.forEach(clause => {
      lines.push(`${clause.number} ${clause.title}`);
      clause.terms.forEach(term => {
        lines.push(term.text);
      });
      lines.push('');
      
      // Subclauses
      if (clause.subclauses) {
        clause.subclauses.forEach(subclause => {
          lines.push(`  ${subclause.number} ${subclause.title}`);
          subclause.terms.forEach(term => {
            lines.push(`  ${term.text}`);
          });
          lines.push('');
        });
      }
    });
  });
  
  // General Provisions
  lines.push(...generateGeneralProvisionsText(contract));
  
  // Signature Block
  lines.push(...generateSignatureBlockText(contract));
  
  return lines.join('\n');
}

// ============================================================================
// GENERAL PROVISIONS
// ============================================================================

export function generateGeneralProvisionsText(contract: Contract): string[] {
  const lines: string[] = [];
  const gp = contract.generalProvisions;
  const nextArticleNumber = contract.articles.length + 1;
  
  lines.push(`ARTICLE ${nextArticleNumber}: GENERAL PROVISIONS`);
  lines.push('');
  
  let clauseNum = 1;
  
  if (gp.entireAgreement) {
    lines.push(`${nextArticleNumber}.${clauseNum} Entire Agreement`);
    lines.push('This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, warranties, and agreements between the parties.');
    lines.push('');
    clauseNum++;
  }
  
  if (gp.amendments) {
    lines.push(`${nextArticleNumber}.${clauseNum} Amendments`);
    lines.push('This Agreement may not be amended or modified except by a written instrument signed by both parties.');
    lines.push('');
    clauseNum++;
  }
  
  if (gp.severability) {
    lines.push(`${nextArticleNumber}.${clauseNum} Severability`);
    lines.push('If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.');
    lines.push('');
    clauseNum++;
  }
  
  if (gp.waiver) {
    lines.push(`${nextArticleNumber}.${clauseNum} Waiver`);
    lines.push('The failure of either party to enforce any provision of this Agreement shall not be construed as a waiver of such provision or the right to enforce it at a later time.');
    lines.push('');
    clauseNum++;
  }
  
  if (gp.notices) {
    lines.push(`${nextArticleNumber}.${clauseNum} Notices`);
    lines.push('All notices required or permitted under this Agreement shall be in writing and shall be delivered personally, sent by certified mail, return receipt requested, or sent by overnight courier to the addresses set forth above or to such other address as either party may designate in writing.');
    lines.push('');
    clauseNum++;
  }
  
  if (gp.assignment) {
    lines.push(`${nextArticleNumber}.${clauseNum} Assignment`);
    lines.push('Neither party may assign or transfer this Agreement without the prior written consent of the other party, except that either party may assign this Agreement to an affiliate or in connection with a merger, acquisition, or sale of all or substantially all of its assets.');
    lines.push('');
    clauseNum++;
  }
  
  if (gp.governingLaw.enabled && gp.governingLaw.jurisdiction) {
    lines.push(`${nextArticleNumber}.${clauseNum} Governing Law`);
    lines.push(`This Agreement shall be governed by and construed in accordance with the laws of ${gp.governingLaw.jurisdiction}, without regard to its conflict of laws principles.`);
    lines.push('');
    clauseNum++;
  }
  
  if (gp.disputeResolution.enabled) {
    lines.push(`${nextArticleNumber}.${clauseNum} Dispute Resolution`);
    if (gp.disputeResolution.method === 'arbitration') {
      lines.push(`Any dispute arising out of or relating to this Agreement shall be settled by binding arbitration in accordance with the rules of the American Arbitration Association${gp.disputeResolution.venue ? `, and such arbitration shall take place in ${gp.disputeResolution.venue}` : ''}.`);
    } else if (gp.disputeResolution.method === 'mediation') {
      lines.push(`Any dispute arising out of or relating to this Agreement shall first be submitted to mediation. If mediation is unsuccessful, either party may pursue any other remedy available at law or in equity${gp.disputeResolution.venue ? `, and any legal action shall be brought in ${gp.disputeResolution.venue}` : ''}.`);
    } else {
      lines.push(`Any dispute arising out of or relating to this Agreement shall be resolved through litigation${gp.disputeResolution.venue ? ` in the courts of ${gp.disputeResolution.venue}` : ''}.`);
    }
    lines.push('');
    clauseNum++;
  }
  
  if (gp.counterparts) {
    lines.push(`${nextArticleNumber}.${clauseNum} Counterparts`);
    lines.push('This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed valid and binding.');
    lines.push('');
    clauseNum++;
  }
  
  if (gp.headings) {
    lines.push(`${nextArticleNumber}.${clauseNum} Headings`);
    lines.push('The headings in this Agreement are for convenience only and shall not affect the interpretation of this Agreement.');
    lines.push('');
  }
  
  return lines;
}

// ============================================================================
// SIGNATURE BLOCK
// ============================================================================

export function generateSignatureBlockText(contract: Contract): string[] {
  const lines: string[] = [];
  
  lines.push('SIGNATURES');
  lines.push('');
  lines.push(contract.signatures.introText);
  lines.push('');
  
  contract.parties.forEach(party => {
    const roleLabel = PARTY_ROLE_LABELS[party.role] || party.role;
    
    lines.push(`${roleLabel.toUpperCase()}:`);
    lines.push('');
    
    if (party.signature?.signatureText) {
      lines.push(`Signature: ${party.signature.signatureText}`);
    } else {
      lines.push('Signature: _____________________________');
    }
    
    lines.push(`Name: ${formatPartyName(party)}`);
    
    if (party.type === 'company' && party.representativeTitle) {
      lines.push(`Title: ${party.representativeTitle}`);
    }
    
    if (party.signature?.signedAt) {
      lines.push(`Date: ${formatContractDate(party.signature.signedAt)}`);
    } else {
      lines.push('Date: _____________________________');
    }
    
    lines.push('');
  });
  
  if (contract.signatures.witnessRequired) {
    lines.push('WITNESS:');
    lines.push('');
    lines.push('Signature: _____________________________');
    lines.push('Name: _____________________________');
    lines.push('Date: _____________________________');
    lines.push('');
  }
  
  return lines;
}

// ============================================================================
// PLACEHOLDER EXTRACTION
// ============================================================================

export function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\[[A-Z_]+\]/g);
  return matches ? [...new Set(matches)] : [];
}

export function hasUnfilledPlaceholders(contract: Contract): boolean {
  for (const article of contract.articles) {
    for (const clause of article.clauses) {
      for (const term of clause.terms) {
        if (term.text.match(/\[[A-Z_]+\]/)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function getAllPlaceholders(contract: Contract): { path: string; placeholder: string }[] {
  const result: { path: string; placeholder: string }[] = [];
  
  contract.articles.forEach((article, aIndex) => {
    article.clauses.forEach((clause, cIndex) => {
      clause.terms.forEach((term, tIndex) => {
        const placeholders = extractPlaceholders(term.text);
        placeholders.forEach(p => {
          result.push({
            path: `articles[${aIndex}].clauses[${cIndex}].terms[${tIndex}].text`,
            placeholder: p
          });
        });
      });
    });
  });
  
  return result;
}

// ============================================================================
// CONTRACT CREATION FROM TEMPLATE
// ============================================================================

export function createContractFromTemplate(
  template: { structure: Omit<Contract, 'id' | 'status' | 'parties'> },
  parties: ContractParty[],
  overrides?: Partial<Contract>
): Contract {
  const now = new Date().toISOString();
  
  return {
    id: crypto.randomUUID(),
    status: 'draft',
    ...template.structure,
    parties,
    metadata: {
      ...template.structure.metadata,
      createdAt: now,
      updatedAt: now
    },
    ...overrides
  };
}

// ============================================================================
// CLAUSE NUMBERING
// ============================================================================

export function renumberClauses(articles: Contract['articles']): Contract['articles'] {
  return articles.map((article, aIndex) => ({
    ...article,
    number: String(aIndex + 1),
    clauses: article.clauses.map((clause, cIndex) => ({
      ...clause,
      number: `${aIndex + 1}.${cIndex + 1}`,
      subclauses: clause.subclauses?.map((subclause, sIndex) => ({
        ...subclause,
        number: `${aIndex + 1}.${cIndex + 1}.${sIndex + 1}`
      }))
    }))
  }));
}
