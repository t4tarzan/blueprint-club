import { useRouter } from 'next/router';
import type { InvitationToken } from '../types/invitation';

const useInvitation = () => {
  const router = useRouter();
  const { invitation } = router.query;

  return {
    invitation: typeof invitation === 'string' ? invitation : null,
  } as { invitation: InvitationToken | null };
};

export default useInvitation;
