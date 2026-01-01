import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewAgreementClient from './ViewAgreementClient';
import { Agreement, Participant } from './ViewAgreementClient';

// Mock the useRouter hook from Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock the supabase client
jest.mock('@/lib/supabaseClient', () => ({
  createClient: () => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { username: 'Creator' }, error: null }),
    update: jest.fn().mockResolvedValue({ error: null }),
  }),
}));

const mockParticipant: Participant = {
  user_id: 'user-123',
  status: 'pending',
  profiles: { username: 'Test User', email: 'test@example.com', avatar_url: null },
};

const mockAgreement: Agreement = {
  id: 'agreement-abc',
  title: 'Test Agreement',
  content: '### Section 1\n- Term 1',
  created_at: new Date().toISOString(),
  created_by: 'creator-456',
  agreement_participants: [mockParticipant],
};

describe('ViewAgreementClient', () => {
  it('should enable the sign button only when the consent checkbox is checked', () => {
    render(<ViewAgreementClient agreement={mockAgreement} userId="user-123" />);

    // Find the sign button and the consent checkbox
    const signButton = screen.getByRole('button', { name: /Sign Agreement/i });
    const consentCheckbox = screen.getByLabelText(
      /i agree to use an electronic signature/i
    );

    // Initially, the button should be disabled
    expect(signButton).toBeDisabled();

    // Simulate user checking the consent box
    fireEvent.click(consentCheckbox);

    // Now, the button should be enabled
    expect(signButton).toBeEnabled();

    // Simulate user unchecking the box
    fireEvent.click(consentCheckbox);

    // The button should be disabled again
    expect(signButton).toBeDisabled();
  });

  it('should show "Agreement Signed" and a disabled button if the user has already signed', () => {
    const signedParticipant: Participant = { ...mockParticipant, status: 'signed' };
    const signedAgreement: Agreement = { ...mockAgreement, agreement_participants: [signedParticipant] };

    render(<ViewAgreementClient agreement={signedAgreement} userId="user-123" />);

    const signButton = screen.getByRole('button', { name: /Agreement Signed/i });

    // The button should be present and disabled
    expect(signButton).toBeInTheDocument();
    expect(signButton).toBeDisabled();

    // The consent checkbox should not be visible
    const consentCheckbox = screen.queryByLabelText(
      /i agree to use an electronic signature/i
    );
    expect(consentCheckbox).not.toBeInTheDocument();
  });
});