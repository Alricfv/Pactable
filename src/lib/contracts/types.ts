/**
 * Professional Contract Types
 * 
 * This module defines the complete type system for legally-sound contracts.
 * Based on standard contract law principles and common legal document structures.
 */

// ============================================================================
// PARTY TYPES
// ============================================================================

export type PartyType = 'individual' | 'company' | 'organization';

export type PartyRole = 
  | 'client' 
  | 'service_provider' 
  | 'landlord' 
  | 'tenant' 
  | 'lender' 
  | 'borrower'
  | 'disclosing_party'
  | 'receiving_party'
  | 'employer'
  | 'contractor'
  | 'buyer'
  | 'seller'
  | 'licensor'
  | 'licensee'
  | 'party_a'
  | 'party_b';

export interface ContractParty {
  id: string;
  role: PartyRole;
  type: PartyType;
  name: string;
  email: string;
  // Individual fields
  title?: string; // Mr., Ms., Dr., etc.
  // Company fields
  companyName?: string;
  registrationNumber?: string;
  representativeName?: string;
  representativeTitle?: string;
  // Address
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  // Signature
  signature?: {
    signedAt?: string; // ISO date
    signatureText?: string;
    ipAddress?: string;
  };
}

// ============================================================================
// CLAUSE TYPES
// ============================================================================

export type ClauseType = 
  | 'standard'      // Regular contractual clause
  | 'recital'       // Background/whereas clause
  | 'definition'    // Definition of terms
  | 'obligation'    // Party obligations
  | 'right'         // Party rights
  | 'condition'     // Conditions precedent/subsequent
  | 'warranty'      // Warranties and representations
  | 'indemnity'     // Indemnification provisions
  | 'limitation'    // Limitation of liability
  | 'termination'   // Termination provisions
  | 'confidential'  // Confidentiality provisions
  | 'dispute'       // Dispute resolution
  | 'general'       // General/miscellaneous provisions
  | 'signature';    // Signature block

export interface ClauseTerm {
  id: string;
  text: string;
  isEditable: boolean;
  placeholder?: string; // For user-fillable fields like [AMOUNT], [DATE]
  required?: boolean;
}

export interface ContractClause {
  id: string;
  number?: string; // e.g., "1", "1.1", "1.1.1"
  type: ClauseType;
  title: string;
  description?: string; // Helper text for users
  terms: ClauseTerm[];
  isRequired: boolean;
  isEditable: boolean;
  // For nested clauses
  subclauses?: ContractClause[];
}

// ============================================================================
// CONTRACT METADATA
// ============================================================================

export type ContractCategory = 
  | 'service_agreement'
  | 'nda'
  | 'employment'
  | 'rental'
  | 'loan'
  | 'sales'
  | 'license'
  | 'partnership'
  | 'consulting'
  | 'freelance'
  | 'general';

export type ContractStatus = 
  | 'draft'
  | 'pending_signatures'
  | 'partially_signed'
  | 'fully_executed'
  | 'expired'
  | 'terminated'
  | 'voided';

export interface ContractMetadata {
  version: string; // Semantic versioning for contract template
  language: string; // ISO 639-1 code, e.g., 'en'
  jurisdiction: string; // Governing law jurisdiction
  createdAt: string;
  updatedAt: string;
  effectiveDate?: string;
  expirationDate?: string;
  renewalTerms?: string;
}

// ============================================================================
// MAIN CONTRACT STRUCTURE
// ============================================================================

export interface Contract {
  id: string;
  title: string;
  category: ContractCategory;
  status: ContractStatus;
  metadata: ContractMetadata;
  
  // Preamble section
  preamble: {
    date: string; // Contract date
    introText: string; // "This Agreement is entered into..."
  };
  
  // Parties to the contract
  parties: ContractParty[];
  
  // Recitals (Background/Whereas clauses)
  recitals: {
    enabled: boolean;
    introText: string; // "WHEREAS" or "BACKGROUND"
    items: string[];
  };
  
  // Definitions section
  definitions: {
    enabled: boolean;
    terms: {
      term: string;
      definition: string;
    }[];
  };
  
  // Main contract body - organized by articles/sections
  articles: {
    id: string;
    number: string;
    title: string;
    clauses: ContractClause[];
  }[];
  
  // Standard boilerplate clauses
  generalProvisions: {
    entireAgreement: boolean;
    amendments: boolean;
    severability: boolean;
    waiver: boolean;
    notices: boolean;
    assignment: boolean;
    counterparts: boolean;
    headings: boolean;
    governingLaw: {
      enabled: boolean;
      jurisdiction: string;
    };
    disputeResolution: {
      enabled: boolean;
      method: 'arbitration' | 'mediation' | 'litigation';
      venue?: string;
    };
  };
  
  // Signature section
  signatures: {
    introText: string;
    witnessRequired: boolean;
    notarizationRequired: boolean;
  };
  
  // Attachments/Schedules/Exhibits
  attachments: {
    id: string;
    title: string;
    description: string;
    content: string;
  }[];
}

// ============================================================================
// CONTRACT TEMPLATE (for creating new contracts)
// ============================================================================

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: ContractCategory;
  icon?: string;
  
  // Default values for quick creation
  defaultPartyRoles: PartyRole[];
  
  // Template structure
  structure: Omit<Contract, 'id' | 'status' | 'parties'>;
  
  // Customization options
  options: {
    allowCustomClauses: boolean;
    allowReorderClauses: boolean;
    allowRemoveClauses: boolean;
    requiredFields: string[]; // Paths to required fields
  };
}

// ============================================================================
// SIGNATURE TYPES
// ============================================================================

export interface SignatureRecord {
  id: string;
  contractId: string;
  partyId: string;
  signatureType: 'typed' | 'drawn' | 'uploaded';
  signatureData: string; // Text or base64 image
  signedAt: string;
  ipAddress?: string;
  userAgent?: string;
  legalConsent: boolean;
  consentText: string;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function isContractValid(contract: Contract): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!contract.title?.trim()) {
    errors.push('Contract title is required');
  }
  
  if (contract.parties.length < 2) {
    errors.push('At least two parties are required');
  }
  
  // Check all parties have names and emails
  contract.parties.forEach((party, index) => {
    if (!party.name?.trim()) {
      errors.push(`Party ${index + 1} name is required`);
    }
    if (!party.email?.trim()) {
      errors.push(`Party ${index + 1} email is required`);
    }
  });
  
  // Check at least one article with clauses
  if (contract.articles.length === 0) {
    errors.push('At least one article/section is required');
  }
  
  contract.articles.forEach((article, aIndex) => {
    if (!article.title?.trim()) {
      errors.push(`Article ${aIndex + 1} title is required`);
    }
    if (article.clauses.length === 0) {
      errors.push(`Article ${aIndex + 1} must have at least one clause`);
    }
    
    article.clauses.forEach((clause, cIndex) => {
      if (clause.isRequired && clause.terms.length === 0) {
        errors.push(`Article ${aIndex + 1}, Clause ${cIndex + 1} must have at least one term`);
      }
      
      // Check for unfilled placeholders in required terms
      clause.terms.forEach((term, tIndex) => {
        if (term.required && term.text.includes('[')) {
          const placeholders = term.text.match(/\[[^\]]+\]/g);
          if (placeholders) {
            errors.push(`Article ${aIndex + 1}, Clause ${cIndex + 1}, Term ${tIndex + 1} has unfilled placeholders: ${placeholders.join(', ')}`);
          }
        }
      });
    });
  });
  
  // Check governing law if enabled
  if (contract.generalProvisions.governingLaw.enabled && !contract.generalProvisions.governingLaw.jurisdiction?.trim()) {
    errors.push('Governing law jurisdiction is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================================
// HELPERS FOR NUMBERING
// ============================================================================

export function generateClauseNumber(articleNumber: string, clauseIndex: number, subclauseIndex?: number): string {
  const clauseNum = `${articleNumber}.${clauseIndex + 1}`;
  if (subclauseIndex !== undefined) {
    return `${clauseNum}.${subclauseIndex + 1}`;
  }
  return clauseNum;
}

export function formatContractDate(date: string | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ============================================================================
// PARTY ROLE LABELS
// ============================================================================

export const PARTY_ROLE_LABELS: Record<PartyRole, string> = {
  client: 'Client',
  service_provider: 'Service Provider',
  landlord: 'Landlord',
  tenant: 'Tenant',
  lender: 'Lender',
  borrower: 'Borrower',
  disclosing_party: 'Disclosing Party',
  receiving_party: 'Receiving Party',
  employer: 'Employer',
  contractor: 'Contractor',
  buyer: 'Buyer',
  seller: 'Seller',
  licensor: 'Licensor',
  licensee: 'Licensee',
  party_a: 'Party A',
  party_b: 'Party B'
};

export const CONTRACT_CATEGORY_LABELS: Record<ContractCategory, string> = {
  service_agreement: 'Service Agreement',
  nda: 'Non-Disclosure Agreement',
  employment: 'Employment Contract',
  rental: 'Rental/Lease Agreement',
  loan: 'Loan Agreement',
  sales: 'Sales Contract',
  license: 'License Agreement',
  partnership: 'Partnership Agreement',
  consulting: 'Consulting Agreement',
  freelance: 'Freelance Contract',
  general: 'General Agreement'
};
