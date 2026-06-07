/**
 * Professional Contract Templates
 * 
 * These templates follow standard legal contract structures with:
 * - Proper preamble and date
 * - Party identification
 * - Recitals (whereas clauses)
 * - Definitions
 * - Numbered articles and clauses
 * - Standard boilerplate provisions
 * - Signature blocks
 */

import type { ContractTemplate, ContractCategory } from './types';

// ============================================================================
// NON-DISCLOSURE AGREEMENT (NDA)
// ============================================================================

export const ndaTemplate: ContractTemplate = {
  id: 'nda_mutual',
  name: 'Mutual Non-Disclosure Agreement',
  description: 'A mutual NDA for protecting confidential information shared between two parties during business discussions, partnerships, or negotiations.',
  category: 'nda',
  icon: '🔒',
  defaultPartyRoles: ['disclosing_party', 'receiving_party'],
  
  structure: {
    title: 'MUTUAL NON-DISCLOSURE AGREEMENT',
    category: 'nda',
    metadata: {
      version: '1.0.0',
      language: 'en',
      jurisdiction: '',
      createdAt: '',
      updatedAt: ''
    },
    
    preamble: {
      date: '',
      introText: 'This Mutual Non-Disclosure Agreement (this "Agreement") is entered into as of the date last signed below (the "Effective Date"), by and between the parties identified herein.'
    },
    
    recitals: {
      enabled: true,
      introText: 'RECITALS',
      items: [
        'The parties wish to explore a potential business relationship (the "Purpose").',
        'In connection with the Purpose, each party may disclose to the other certain confidential and proprietary information.',
        'The parties desire to establish the terms under which such confidential information will be disclosed and protected.'
      ]
    },
    
    definitions: {
      enabled: true,
      terms: [
        {
          term: 'Confidential Information',
          definition: 'means any and all non-public information, in any form, disclosed by one party (the "Disclosing Party") to the other party (the "Receiving Party"), including but not limited to: business plans, financial information, technical data, trade secrets, know-how, inventions, processes, techniques, algorithms, software, designs, drawings, customer lists, marketing strategies, and any other information designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure.'
        },
        {
          term: 'Disclosing Party',
          definition: 'means the party disclosing Confidential Information under this Agreement.'
        },
        {
          term: 'Receiving Party',
          definition: 'means the party receiving Confidential Information under this Agreement.'
        },
        {
          term: 'Representatives',
          definition: 'means a party\'s employees, officers, directors, agents, advisors, and contractors who have a need to know the Confidential Information for the Purpose.'
        }
      ]
    },
    
    articles: [
      {
        id: 'art_1',
        number: '1',
        title: 'CONFIDENTIALITY OBLIGATIONS',
        clauses: [
          {
            id: 'cl_1_1',
            number: '1.1',
            type: 'obligation',
            title: 'Protection of Confidential Information',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_1_1',
                text: 'The Receiving Party shall hold and maintain the Confidential Information in strict confidence and shall not disclose, publish, or otherwise disseminate any Confidential Information to any third party without the prior written consent of the Disclosing Party.',
                isEditable: false,
                required: true
              },
              {
                id: 't_1_1_2',
                text: 'The Receiving Party shall protect the Confidential Information using the same degree of care it uses to protect its own confidential information, but in no event less than reasonable care.',
                isEditable: false,
                required: true
              },
              {
                id: 't_1_1_3',
                text: 'The Receiving Party shall limit access to Confidential Information to its Representatives who have a need to know such information for the Purpose and who are bound by confidentiality obligations at least as protective as those contained herein.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_1_2',
            number: '1.2',
            type: 'standard',
            title: 'Permitted Use',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_2_1',
                text: 'The Receiving Party shall use the Confidential Information solely for the Purpose and for no other purpose whatsoever.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_1_3',
            number: '1.3',
            type: 'standard',
            title: 'Exclusions from Confidential Information',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_1_3_1',
                text: 'Confidential Information shall not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was rightfully in the Receiving Party\'s possession prior to disclosure; (c) is rightfully obtained by the Receiving Party from a third party without restriction; or (d) is independently developed by the Receiving Party without use of the Confidential Information.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_2',
        number: '2',
        title: 'COMPELLED DISCLOSURE',
        clauses: [
          {
            id: 'cl_2_1',
            number: '2.1',
            type: 'standard',
            title: 'Legal Requirements',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_2_1_1',
                text: 'If the Receiving Party is compelled by law, regulation, or court order to disclose any Confidential Information, it shall provide the Disclosing Party with prompt written notice (to the extent legally permitted) so that the Disclosing Party may seek a protective order or other appropriate remedy.',
                isEditable: false,
                required: true
              },
              {
                id: 't_2_1_2',
                text: 'The Receiving Party shall disclose only that portion of the Confidential Information that it is legally required to disclose and shall use reasonable efforts to obtain confidential treatment for any Confidential Information so disclosed.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_3',
        number: '3',
        title: 'TERM AND TERMINATION',
        clauses: [
          {
            id: 'cl_3_1',
            number: '3.1',
            type: 'termination',
            title: 'Term',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_3_1_1',
                text: 'This Agreement shall remain in effect for a period of [DURATION] from the Effective Date, unless earlier terminated by either party upon [NOTICE_PERIOD] days\' written notice to the other party.',
                isEditable: true,
                placeholder: '[DURATION] = e.g., "two (2) years", [NOTICE_PERIOD] = e.g., "thirty (30)"',
                required: true
              }
            ]
          },
          {
            id: 'cl_3_2',
            number: '3.2',
            type: 'termination',
            title: 'Survival',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_3_2_1',
                text: 'The confidentiality obligations under this Agreement shall survive termination and continue for a period of [SURVIVAL_PERIOD] years from the date of disclosure of the relevant Confidential Information.',
                isEditable: true,
                placeholder: '[SURVIVAL_PERIOD] = e.g., "five (5)"',
                required: true
              }
            ]
          },
          {
            id: 'cl_3_3',
            number: '3.3',
            type: 'termination',
            title: 'Return of Materials',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_3_3_1',
                text: 'Upon termination of this Agreement or upon request by the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof, and shall certify in writing that it has done so.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_4',
        number: '4',
        title: 'NO LICENSE OR WARRANTY',
        clauses: [
          {
            id: 'cl_4_1',
            number: '4.1',
            type: 'standard',
            title: 'No License Granted',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_4_1_1',
                text: 'Nothing in this Agreement grants any rights to either party under any patent, copyright, trademark, or other intellectual property right of the other party, nor shall this Agreement grant any party any rights in or to the other party\'s Confidential Information, except the limited right to use such Confidential Information for the Purpose.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_4_2',
            number: '4.2',
            type: 'warranty',
            title: 'No Warranty',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_4_2_1',
                text: 'ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS." THE DISCLOSING PARTY MAKES NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE ACCURACY, COMPLETENESS, OR PERFORMANCE OF ANY CONFIDENTIAL INFORMATION.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_5',
        number: '5',
        title: 'REMEDIES',
        clauses: [
          {
            id: 'cl_5_1',
            number: '5.1',
            type: 'standard',
            title: 'Injunctive Relief',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_5_1_1',
                text: 'Each party acknowledges that any breach of this Agreement may cause irreparable harm for which monetary damages would be inadequate. Accordingly, the Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to any other remedies available at law or in equity.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      }
    ],
    
    generalProvisions: {
      entireAgreement: true,
      amendments: true,
      severability: true,
      waiver: true,
      notices: true,
      assignment: true,
      counterparts: true,
      headings: true,
      governingLaw: {
        enabled: true,
        jurisdiction: ''
      },
      disputeResolution: {
        enabled: true,
        method: 'arbitration',
        venue: ''
      }
    },
    
    signatures: {
      introText: 'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date last signed below.',
      witnessRequired: false,
      notarizationRequired: false
    },
    
    attachments: []
  },
  
  options: {
    allowCustomClauses: true,
    allowReorderClauses: false,
    allowRemoveClauses: false,
    requiredFields: [
      'preamble.date',
      'parties[0].name',
      'parties[0].email',
      'parties[1].name', 
      'parties[1].email',
      'generalProvisions.governingLaw.jurisdiction'
    ]
  }
};

// ============================================================================
// SERVICE AGREEMENT
// ============================================================================

export const serviceAgreementTemplate: ContractTemplate = {
  id: 'service_agreement',
  name: 'Professional Service Agreement',
  description: 'A comprehensive service agreement for freelancers, consultants, and service providers. Covers scope of work, payment terms, intellectual property, and liability.',
  category: 'service_agreement',
  icon: '📋',
  defaultPartyRoles: ['client', 'service_provider'],
  
  structure: {
    title: 'PROFESSIONAL SERVICE AGREEMENT',
    category: 'service_agreement',
    metadata: {
      version: '1.0.0',
      language: 'en',
      jurisdiction: '',
      createdAt: '',
      updatedAt: ''
    },
    
    preamble: {
      date: '',
      introText: 'This Professional Service Agreement (this "Agreement") is entered into as of the Effective Date set forth below, by and between the parties identified herein.'
    },
    
    recitals: {
      enabled: true,
      introText: 'RECITALS',
      items: [
        'The Client desires to engage the Service Provider to perform certain services as described herein.',
        'The Service Provider has the requisite skills, experience, and resources to perform such services.',
        'The parties desire to set forth the terms and conditions under which the Service Provider will provide services to the Client.'
      ]
    },
    
    definitions: {
      enabled: true,
      terms: [
        {
          term: 'Services',
          definition: 'means the services to be provided by the Service Provider as described in Schedule A attached hereto.'
        },
        {
          term: 'Deliverables',
          definition: 'means all work product, materials, documents, and other tangible results produced by the Service Provider in the course of performing the Services.'
        },
        {
          term: 'Fees',
          definition: 'means the compensation payable to the Service Provider for the Services as set forth in Schedule B attached hereto.'
        },
        {
          term: 'Effective Date',
          definition: 'means the date this Agreement is last signed by both parties.'
        }
      ]
    },
    
    articles: [
      {
        id: 'art_1',
        number: '1',
        title: 'ENGAGEMENT AND SERVICES',
        clauses: [
          {
            id: 'cl_1_1',
            number: '1.1',
            type: 'standard',
            title: 'Engagement',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_1_1',
                text: 'The Client hereby engages the Service Provider, and the Service Provider hereby accepts such engagement, to provide the Services described in this Agreement and any attached schedules.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_1_2',
            number: '1.2',
            type: 'obligation',
            title: 'Scope of Services',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_2_1',
                text: 'The Service Provider shall perform the following services: [DESCRIBE_SERVICES]',
                isEditable: true,
                placeholder: '[DESCRIBE_SERVICES] = Detailed description of services to be provided',
                required: true
              }
            ]
          },
          {
            id: 'cl_1_3',
            number: '1.3',
            type: 'standard',
            title: 'Standard of Performance',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_1_3_1',
                text: 'The Service Provider shall perform the Services in a professional and workmanlike manner, consistent with industry standards and in accordance with all applicable laws and regulations.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_1_4',
            number: '1.4',
            type: 'standard',
            title: 'Timeline',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_4_1',
                text: 'The Services shall commence on [START_DATE] and shall be completed by [END_DATE], unless otherwise agreed in writing by the parties.',
                isEditable: true,
                placeholder: '[START_DATE] and [END_DATE] = Project dates',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_2',
        number: '2',
        title: 'COMPENSATION AND PAYMENT',
        clauses: [
          {
            id: 'cl_2_1',
            number: '2.1',
            type: 'standard',
            title: 'Fees',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_2_1_1',
                text: 'In consideration for the Services, the Client shall pay the Service Provider the total amount of [TOTAL_AMOUNT] ([AMOUNT_IN_WORDS]), payable as follows: [PAYMENT_SCHEDULE].',
                isEditable: true,
                placeholder: '[TOTAL_AMOUNT] = e.g., "$5,000.00", [AMOUNT_IN_WORDS] = e.g., "Five Thousand Dollars", [PAYMENT_SCHEDULE] = e.g., "50% upon signing, 50% upon completion"',
                required: true
              }
            ]
          },
          {
            id: 'cl_2_2',
            number: '2.2',
            type: 'standard',
            title: 'Payment Terms',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_2_2_1',
                text: 'All invoices are due and payable within [PAYMENT_DAYS] days of receipt. Late payments shall bear interest at the rate of [INTEREST_RATE]% per month or the maximum rate permitted by law, whichever is less.',
                isEditable: true,
                placeholder: '[PAYMENT_DAYS] = e.g., "thirty (30)", [INTEREST_RATE] = e.g., "1.5"',
                required: true
              }
            ]
          },
          {
            id: 'cl_2_3',
            number: '2.3',
            type: 'standard',
            title: 'Expenses',
            isRequired: false,
            isEditable: true,
            terms: [
              {
                id: 't_2_3_1',
                text: 'The Client shall reimburse the Service Provider for all pre-approved, reasonable out-of-pocket expenses incurred in connection with the Services, provided that the Service Provider submits itemized receipts.',
                isEditable: true,
                required: false
              }
            ]
          }
        ]
      },
      {
        id: 'art_3',
        number: '3',
        title: 'INTELLECTUAL PROPERTY',
        clauses: [
          {
            id: 'cl_3_1',
            number: '3.1',
            type: 'right',
            title: 'Ownership of Deliverables',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_3_1_1',
                text: 'Upon full payment of all Fees, all Deliverables created by the Service Provider specifically for the Client under this Agreement shall become the exclusive property of the Client, including all intellectual property rights therein.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_3_2',
            number: '3.2',
            type: 'right',
            title: 'Pre-Existing Materials',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_3_2_1',
                text: 'The Service Provider retains all rights to any pre-existing materials, tools, methodologies, and intellectual property that the Service Provider brings to the engagement. The Service Provider grants the Client a non-exclusive, perpetual license to use any such pre-existing materials incorporated into the Deliverables.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_4',
        number: '4',
        title: 'CONFIDENTIALITY',
        clauses: [
          {
            id: 'cl_4_1',
            number: '4.1',
            type: 'confidential',
            title: 'Confidential Information',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_4_1_1',
                text: 'Each party agrees to hold in confidence all non-public information received from the other party in connection with this Agreement and to use such information only for purposes of this Agreement.',
                isEditable: false,
                required: true
              },
              {
                id: 't_4_1_2',
                text: 'This obligation of confidentiality shall survive the termination or expiration of this Agreement for a period of three (3) years.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_5',
        number: '5',
        title: 'WARRANTIES AND REPRESENTATIONS',
        clauses: [
          {
            id: 'cl_5_1',
            number: '5.1',
            type: 'warranty',
            title: 'Service Provider Warranties',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_5_1_1',
                text: 'The Service Provider warrants that: (a) it has the right and authority to enter into this Agreement; (b) the Services will be performed in a professional manner consistent with industry standards; (c) the Deliverables will be original work and will not infringe upon the intellectual property rights of any third party.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_5_2',
            number: '5.2',
            type: 'warranty',
            title: 'Client Warranties',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_5_2_1',
                text: 'The Client warrants that: (a) it has the right and authority to enter into this Agreement; (b) it will provide the Service Provider with accurate and complete information necessary for the performance of the Services.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_6',
        number: '6',
        title: 'LIMITATION OF LIABILITY',
        clauses: [
          {
            id: 'cl_6_1',
            number: '6.1',
            type: 'limitation',
            title: 'Limitation',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_6_1_1',
                text: 'IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT.',
                isEditable: false,
                required: true
              },
              {
                id: 't_6_1_2',
                text: 'THE TOTAL LIABILITY OF THE SERVICE PROVIDER UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY THE CLIENT UNDER THIS AGREEMENT.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_7',
        number: '7',
        title: 'TERM AND TERMINATION',
        clauses: [
          {
            id: 'cl_7_1',
            number: '7.1',
            type: 'termination',
            title: 'Term',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_7_1_1',
                text: 'This Agreement shall commence on the Effective Date and shall continue until all Services have been completed, unless earlier terminated in accordance with this Article.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_7_2',
            number: '7.2',
            type: 'termination',
            title: 'Termination for Convenience',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_7_2_1',
                text: 'Either party may terminate this Agreement upon [NOTICE_PERIOD] days\' written notice to the other party. In the event of such termination, the Client shall pay the Service Provider for all Services rendered up to the date of termination.',
                isEditable: true,
                placeholder: '[NOTICE_PERIOD] = e.g., "fourteen (14)"',
                required: true
              }
            ]
          },
          {
            id: 'cl_7_3',
            number: '7.3',
            type: 'termination',
            title: 'Termination for Cause',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_7_3_1',
                text: 'Either party may terminate this Agreement immediately upon written notice if the other party materially breaches this Agreement and fails to cure such breach within fifteen (15) days after receiving written notice thereof.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_8',
        number: '8',
        title: 'INDEPENDENT CONTRACTOR',
        clauses: [
          {
            id: 'cl_8_1',
            number: '8.1',
            type: 'standard',
            title: 'Relationship',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_8_1_1',
                text: 'The Service Provider is an independent contractor and not an employee, partner, or agent of the Client. Nothing in this Agreement shall create an employment relationship, partnership, or joint venture between the parties.',
                isEditable: false,
                required: true
              },
              {
                id: 't_8_1_2',
                text: 'The Service Provider shall be solely responsible for all taxes, withholdings, and other statutory obligations arising from the Fees received under this Agreement.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      }
    ],
    
    generalProvisions: {
      entireAgreement: true,
      amendments: true,
      severability: true,
      waiver: true,
      notices: true,
      assignment: true,
      counterparts: true,
      headings: true,
      governingLaw: {
        enabled: true,
        jurisdiction: ''
      },
      disputeResolution: {
        enabled: true,
        method: 'mediation',
        venue: ''
      }
    },
    
    signatures: {
      introText: 'IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.',
      witnessRequired: false,
      notarizationRequired: false
    },
    
    attachments: [
      {
        id: 'schedule_a',
        title: 'Schedule A - Scope of Services',
        description: 'Detailed description of services to be provided',
        content: ''
      },
      {
        id: 'schedule_b',
        title: 'Schedule B - Fee Schedule',
        description: 'Detailed breakdown of fees and payment milestones',
        content: ''
      }
    ]
  },
  
  options: {
    allowCustomClauses: true,
    allowReorderClauses: true,
    allowRemoveClauses: true,
    requiredFields: [
      'preamble.date',
      'parties[0].name',
      'parties[0].email',
      'parties[1].name',
      'parties[1].email',
      'generalProvisions.governingLaw.jurisdiction'
    ]
  }
};

// ============================================================================
// RENTAL/LEASE AGREEMENT
// ============================================================================

export const rentalAgreementTemplate: ContractTemplate = {
  id: 'rental_agreement',
  name: 'Residential Rental Agreement',
  description: 'A standard residential lease agreement covering rent, security deposit, maintenance responsibilities, and house rules.',
  category: 'rental',
  icon: '🏠',
  defaultPartyRoles: ['landlord', 'tenant'],
  
  structure: {
    title: 'RESIDENTIAL RENTAL AGREEMENT',
    category: 'rental',
    metadata: {
      version: '1.0.0',
      language: 'en',
      jurisdiction: '',
      createdAt: '',
      updatedAt: ''
    },
    
    preamble: {
      date: '',
      introText: 'This Residential Rental Agreement (this "Lease" or "Agreement") is entered into as of the date set forth below, by and between the Landlord and Tenant identified herein.'
    },
    
    recitals: {
      enabled: true,
      introText: 'RECITALS',
      items: [
        'The Landlord is the owner of the Property described herein.',
        'The Tenant desires to lease the Property from the Landlord for residential purposes.',
        'The parties desire to set forth the terms and conditions of such lease.'
      ]
    },
    
    definitions: {
      enabled: true,
      terms: [
        {
          term: 'Property',
          definition: 'means the residential premises located at the address specified in Article 1.'
        },
        {
          term: 'Rent',
          definition: 'means the monthly rental amount specified in Article 2.'
        },
        {
          term: 'Security Deposit',
          definition: 'means the deposit paid by the Tenant to secure performance of the Tenant\'s obligations under this Lease.'
        },
        {
          term: 'Lease Term',
          definition: 'means the period during which this Lease is in effect, as specified in Article 1.'
        }
      ]
    },
    
    articles: [
      {
        id: 'art_1',
        number: '1',
        title: 'PROPERTY AND TERM',
        clauses: [
          {
            id: 'cl_1_1',
            number: '1.1',
            type: 'standard',
            title: 'Premises',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_1_1',
                text: 'The Landlord hereby leases to the Tenant, and the Tenant hereby leases from the Landlord, the property located at: [PROPERTY_ADDRESS] (the "Property").',
                isEditable: true,
                placeholder: '[PROPERTY_ADDRESS] = Full street address of the rental property',
                required: true
              }
            ]
          },
          {
            id: 'cl_1_2',
            number: '1.2',
            type: 'standard',
            title: 'Lease Term',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_2_1',
                text: 'The Lease Term shall commence on [START_DATE] and shall expire on [END_DATE], unless sooner terminated or extended in accordance with this Agreement.',
                isEditable: true,
                placeholder: '[START_DATE] and [END_DATE] = Lease start and end dates',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_2',
        number: '2',
        title: 'RENT AND DEPOSITS',
        clauses: [
          {
            id: 'cl_2_1',
            number: '2.1',
            type: 'standard',
            title: 'Monthly Rent',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_2_1_1',
                text: 'The Tenant shall pay to the Landlord monthly rent in the amount of [RENT_AMOUNT] ([RENT_IN_WORDS]), due on the [DUE_DAY] day of each month.',
                isEditable: true,
                placeholder: '[RENT_AMOUNT] = e.g., "$1,500.00", [RENT_IN_WORDS] = e.g., "One Thousand Five Hundred Dollars", [DUE_DAY] = e.g., "first (1st)"',
                required: true
              }
            ]
          },
          {
            id: 'cl_2_2',
            number: '2.2',
            type: 'standard',
            title: 'Security Deposit',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_2_2_1',
                text: 'Upon execution of this Agreement, the Tenant shall pay a security deposit in the amount of [DEPOSIT_AMOUNT] ([DEPOSIT_IN_WORDS]). The security deposit shall be held by the Landlord as security for the Tenant\'s faithful performance of its obligations under this Lease.',
                isEditable: true,
                placeholder: '[DEPOSIT_AMOUNT] = e.g., "$1,500.00", [DEPOSIT_IN_WORDS] = e.g., "One Thousand Five Hundred Dollars"',
                required: true
              }
            ]
          },
          {
            id: 'cl_2_3',
            number: '2.3',
            type: 'standard',
            title: 'Late Payment',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_2_3_1',
                text: 'If rent is not received by the Landlord within [GRACE_PERIOD] days after the due date, the Tenant shall pay a late fee of [LATE_FEE] in addition to the rent.',
                isEditable: true,
                placeholder: '[GRACE_PERIOD] = e.g., "five (5)", [LATE_FEE] = e.g., "$50.00"',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_3',
        number: '3',
        title: 'USE OF PROPERTY',
        clauses: [
          {
            id: 'cl_3_1',
            number: '3.1',
            type: 'obligation',
            title: 'Permitted Use',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_3_1_1',
                text: 'The Property shall be used solely for residential purposes and shall not be used for any commercial, illegal, or immoral purposes.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_3_2',
            number: '3.2',
            type: 'obligation',
            title: 'Occupancy',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_3_2_1',
                text: 'The Property shall be occupied only by the Tenant and the following approved occupants: [APPROVED_OCCUPANTS]. No additional persons shall reside at the Property without the prior written consent of the Landlord.',
                isEditable: true,
                placeholder: '[APPROVED_OCCUPANTS] = Names of all approved residents',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_4',
        number: '4',
        title: 'MAINTENANCE AND REPAIRS',
        clauses: [
          {
            id: 'cl_4_1',
            number: '4.1',
            type: 'obligation',
            title: 'Landlord Responsibilities',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_4_1_1',
                text: 'The Landlord shall maintain the Property in a habitable condition and shall be responsible for repairs to the structure, plumbing, heating, electrical systems, and appliances provided by the Landlord.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_4_2',
            number: '4.2',
            type: 'obligation',
            title: 'Tenant Responsibilities',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_4_2_1',
                text: 'The Tenant shall keep the Property clean and in good condition, properly dispose of garbage, and promptly notify the Landlord of any needed repairs or maintenance.',
                isEditable: false,
                required: true
              },
              {
                id: 't_4_2_2',
                text: 'The Tenant shall be responsible for any damage to the Property caused by the Tenant, the Tenant\'s guests, or the Tenant\'s pets, ordinary wear and tear excepted.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_5',
        number: '5',
        title: 'UTILITIES AND SERVICES',
        clauses: [
          {
            id: 'cl_5_1',
            number: '5.1',
            type: 'standard',
            title: 'Utilities',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_5_1_1',
                text: 'The Tenant shall be responsible for payment of the following utilities: [TENANT_UTILITIES]. The Landlord shall be responsible for payment of the following utilities: [LANDLORD_UTILITIES].',
                isEditable: true,
                placeholder: '[TENANT_UTILITIES] = e.g., "electricity, gas, internet", [LANDLORD_UTILITIES] = e.g., "water, garbage"',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_6',
        number: '6',
        title: 'TERMINATION',
        clauses: [
          {
            id: 'cl_6_1',
            number: '6.1',
            type: 'termination',
            title: 'Notice to Vacate',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_6_1_1',
                text: 'Either party may terminate this Lease at the end of the Lease Term by providing written notice at least [NOTICE_PERIOD] days prior to the expiration date.',
                isEditable: true,
                placeholder: '[NOTICE_PERIOD] = e.g., "thirty (30)"',
                required: true
              }
            ]
          },
          {
            id: 'cl_6_2',
            number: '6.2',
            type: 'termination',
            title: 'Return of Security Deposit',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_6_2_1',
                text: 'Upon termination of this Lease and vacation of the Property by the Tenant, the Landlord shall return the security deposit to the Tenant within the time required by applicable law, less any amounts deducted for unpaid rent or damages beyond normal wear and tear.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      }
    ],
    
    generalProvisions: {
      entireAgreement: true,
      amendments: true,
      severability: true,
      waiver: true,
      notices: true,
      assignment: false,
      counterparts: true,
      headings: true,
      governingLaw: {
        enabled: true,
        jurisdiction: ''
      },
      disputeResolution: {
        enabled: true,
        method: 'mediation',
        venue: ''
      }
    },
    
    signatures: {
      introText: 'IN WITNESS WHEREOF, the parties have executed this Lease as of the date first written above.',
      witnessRequired: false,
      notarizationRequired: false
    },
    
    attachments: [
      {
        id: 'property_condition',
        title: 'Exhibit A - Property Condition Checklist',
        description: 'Move-in/move-out condition report',
        content: ''
      }
    ]
  },
  
  options: {
    allowCustomClauses: true,
    allowReorderClauses: false,
    allowRemoveClauses: false,
    requiredFields: [
      'preamble.date',
      'parties[0].name',
      'parties[0].email',
      'parties[1].name',
      'parties[1].email',
      'generalProvisions.governingLaw.jurisdiction'
    ]
  }
};

// ============================================================================
// LOAN AGREEMENT
// ============================================================================

export const loanAgreementTemplate: ContractTemplate = {
  id: 'loan_agreement',
  name: 'Personal Loan Agreement',
  description: 'A simple loan agreement between individuals for personal loans, covering principal, interest, repayment schedule, and default provisions.',
  category: 'loan',
  icon: '💰',
  defaultPartyRoles: ['lender', 'borrower'],
  
  structure: {
    title: 'PERSONAL LOAN AGREEMENT',
    category: 'loan',
    metadata: {
      version: '1.0.0',
      language: 'en',
      jurisdiction: '',
      createdAt: '',
      updatedAt: ''
    },
    
    preamble: {
      date: '',
      introText: 'This Personal Loan Agreement (this "Agreement") is entered into as of the date set forth below, by and between the Lender and Borrower identified herein.'
    },
    
    recitals: {
      enabled: true,
      introText: 'RECITALS',
      items: [
        'The Borrower has requested a loan from the Lender in the principal amount set forth herein.',
        'The Lender is willing to make such loan on the terms and conditions set forth in this Agreement.',
        'The parties desire to set forth the terms of the loan in writing.'
      ]
    },
    
    definitions: {
      enabled: true,
      terms: [
        {
          term: 'Principal',
          definition: 'means the original amount of the loan as specified in Article 1.'
        },
        {
          term: 'Interest Rate',
          definition: 'means the annual percentage rate of interest charged on the outstanding Principal.'
        },
        {
          term: 'Maturity Date',
          definition: 'means the date on which the entire outstanding balance of the loan becomes due and payable.'
        }
      ]
    },
    
    articles: [
      {
        id: 'art_1',
        number: '1',
        title: 'LOAN TERMS',
        clauses: [
          {
            id: 'cl_1_1',
            number: '1.1',
            type: 'standard',
            title: 'Principal Amount',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_1_1',
                text: 'The Lender agrees to loan to the Borrower, and the Borrower agrees to borrow from the Lender, the principal sum of [PRINCIPAL_AMOUNT] ([PRINCIPAL_IN_WORDS]) (the "Principal").',
                isEditable: true,
                placeholder: '[PRINCIPAL_AMOUNT] = e.g., "$10,000.00", [PRINCIPAL_IN_WORDS] = e.g., "Ten Thousand Dollars"',
                required: true
              }
            ]
          },
          {
            id: 'cl_1_2',
            number: '1.2',
            type: 'standard',
            title: 'Interest',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_2_1',
                text: 'The outstanding Principal shall bear interest at the rate of [INTEREST_RATE] percent ([INTEREST_RATE]%) per annum, calculated on a simple interest basis.',
                isEditable: true,
                placeholder: '[INTEREST_RATE] = e.g., "5"',
                required: true
              }
            ]
          },
          {
            id: 'cl_1_3',
            number: '1.3',
            type: 'standard',
            title: 'Repayment',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_3_1',
                text: 'The Borrower shall repay the Principal together with all accrued interest as follows: [REPAYMENT_SCHEDULE]. All payments shall be due on the [PAYMENT_DAY] day of each [PAYMENT_PERIOD].',
                isEditable: true,
                placeholder: '[REPAYMENT_SCHEDULE] = e.g., "in 12 equal monthly installments of $875.00", [PAYMENT_DAY] = e.g., "first (1st)", [PAYMENT_PERIOD] = e.g., "month"',
                required: true
              }
            ]
          },
          {
            id: 'cl_1_4',
            number: '1.4',
            type: 'standard',
            title: 'Maturity Date',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_1_4_1',
                text: 'The entire outstanding balance of this loan, including all accrued and unpaid interest, shall be due and payable in full on [MATURITY_DATE] (the "Maturity Date").',
                isEditable: true,
                placeholder: '[MATURITY_DATE] = Final payment date',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_2',
        number: '2',
        title: 'PREPAYMENT',
        clauses: [
          {
            id: 'cl_2_1',
            number: '2.1',
            type: 'right',
            title: 'Prepayment Right',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_2_1_1',
                text: 'The Borrower may prepay all or any portion of the outstanding Principal at any time without penalty. Any prepayment shall be applied first to accrued interest and then to the Principal.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_3',
        number: '3',
        title: 'DEFAULT',
        clauses: [
          {
            id: 'cl_3_1',
            number: '3.1',
            type: 'standard',
            title: 'Events of Default',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_3_1_1',
                text: 'The following shall constitute events of default: (a) the Borrower fails to make any payment when due; (b) the Borrower breaches any other term of this Agreement; (c) the Borrower becomes insolvent or files for bankruptcy.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_3_2',
            number: '3.2',
            type: 'standard',
            title: 'Acceleration',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_3_2_1',
                text: 'Upon the occurrence of an event of default, the Lender may declare the entire unpaid Principal, together with all accrued interest and costs, immediately due and payable.',
                isEditable: false,
                required: true
              }
            ]
          },
          {
            id: 'cl_3_3',
            number: '3.3',
            type: 'standard',
            title: 'Late Fee',
            isRequired: true,
            isEditable: true,
            terms: [
              {
                id: 't_3_3_1',
                text: 'If any payment is not received within [GRACE_PERIOD] days of the due date, the Borrower shall pay a late fee of [LATE_FEE] or [LATE_FEE_PERCENT]% of the overdue amount, whichever is greater.',
                isEditable: true,
                placeholder: '[GRACE_PERIOD] = e.g., "ten (10)", [LATE_FEE] = e.g., "$25.00", [LATE_FEE_PERCENT] = e.g., "5"',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'art_4',
        number: '4',
        title: 'REPRESENTATIONS AND WARRANTIES',
        clauses: [
          {
            id: 'cl_4_1',
            number: '4.1',
            type: 'warranty',
            title: 'Borrower Representations',
            isRequired: true,
            isEditable: false,
            terms: [
              {
                id: 't_4_1_1',
                text: 'The Borrower represents and warrants that: (a) the Borrower has the legal capacity to enter into this Agreement; (b) the Borrower is not currently in default on any other loan or obligation; (c) all information provided to the Lender is accurate and complete.',
                isEditable: false,
                required: true
              }
            ]
          }
        ]
      }
    ],
    
    generalProvisions: {
      entireAgreement: true,
      amendments: true,
      severability: true,
      waiver: true,
      notices: true,
      assignment: true,
      counterparts: true,
      headings: true,
      governingLaw: {
        enabled: true,
        jurisdiction: ''
      },
      disputeResolution: {
        enabled: true,
        method: 'arbitration',
        venue: ''
      }
    },
    
    signatures: {
      introText: 'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.',
      witnessRequired: true,
      notarizationRequired: false
    },
    
    attachments: []
  },
  
  options: {
    allowCustomClauses: false,
    allowReorderClauses: false,
    allowRemoveClauses: false,
    requiredFields: [
      'preamble.date',
      'parties[0].name',
      'parties[0].email',
      'parties[1].name',
      'parties[1].email',
      'generalProvisions.governingLaw.jurisdiction'
    ]
  }
};

// ============================================================================
// CUSTOM/BLANK TEMPLATE
// ============================================================================

export const customTemplate: ContractTemplate = {
  id: 'custom_agreement',
  name: 'Custom Agreement',
  description: 'Start from scratch and build your own custom agreement with full flexibility over parties, terms, and clauses.',
  category: 'general',
  icon: '✏️',
  defaultPartyRoles: ['party_a', 'party_b'],
  
  structure: {
    title: 'CUSTOM AGREEMENT',
    category: 'general',
    metadata: {
      version: '1.0.0',
      language: 'en',
      jurisdiction: '',
      createdAt: '',
      updatedAt: ''
    },
    
    preamble: {
      date: '',
      introText: 'This Agreement (this "Agreement") is entered into as of the Effective Date set forth below, by and between the parties identified herein.'
    },
    
    recitals: {
      enabled: false,
      introText: 'RECITALS',
      items: []
    },
    
    definitions: {
      enabled: false,
      terms: []
    },
    
    articles: [
      {
        id: 'art_1',
        number: '1',
        title: 'TERMS AND CONDITIONS',
        clauses: [
          {
            id: 'cl_1_1',
            number: '1.1',
            type: 'standard',
            title: 'General Terms',
            isRequired: false,
            isEditable: true,
            terms: [
              {
                id: 't_1_1_1',
                text: '',
                isEditable: true,
                required: false,
                placeholder: 'Enter your terms here...'
              }
            ]
          }
        ]
      }
    ],
    
    generalProvisions: {
      entireAgreement: true,
      amendments: true,
      severability: true,
      waiver: true,
      notices: true,
      assignment: false,
      counterparts: true,
      headings: true,
      governingLaw: {
        enabled: true,
        jurisdiction: ''
      },
      disputeResolution: {
        enabled: false,
        method: 'mediation',
        venue: ''
      }
    },
    
    signatures: {
      introText: 'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.',
      witnessRequired: false,
      notarizationRequired: false
    },
    
    attachments: []
  },
  
  options: {
    allowCustomClauses: true,
    allowReorderClauses: true,
    allowRemoveClauses: true,
    requiredFields: [
      'preamble.date',
      'parties[0].name',
      'parties[1].name'
    ]
  }
};

// ============================================================================
// EXPORT ALL TEMPLATES
// ============================================================================

export const contractTemplates: ContractTemplate[] = [
  ndaTemplate,
  serviceAgreementTemplate,
  rentalAgreementTemplate,
  loanAgreementTemplate,
  customTemplate
];

export function getTemplateById(id: string): ContractTemplate | undefined {
  return contractTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: ContractCategory): ContractTemplate[] {
  return contractTemplates.filter(t => t.category === category);
}
