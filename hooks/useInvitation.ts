import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import type { InvitationToken } from '../types/invitation';
import { defaultHeaders } from '@/lib/common';

interface InvitationResponse {
  email?: string;
  teamId?: string;
  role?: string;
}

interface UseInvitationReturn {
  isLoading: boolean;
  error: string | null;
  invitation: InvitationToken;
  invitationDetails: InvitationResponse | null;
}

const useInvitation = (): UseInvitationReturn => {
  const router = useRouter();
  const { invitation } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitationDetails, setInvitationDetails] = useState<InvitationResponse | null>(null);

  useEffect(() => {
    const fetchInvitationDetails = async () => {
      if (!invitation) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/invitations/${invitation}`, {
          method: 'GET',
          headers: defaultHeaders,
        });

        if (!response.ok) {
          throw new Error('Invalid invitation');
        }

        const data = await response.json();
        setInvitationDetails(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch invitation details');
        setInvitationDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitationDetails();
  }, [invitation]);

  return {
    isLoading,
    error,
    invitation: typeof invitation === 'string' ? invitation : null,
    invitationDetails,
  };
};

export default useInvitation;
