import { useRouter } from 'next/router';

const useInvitation = () => {
  const router = useRouter();
  const { invitation } = router.query;

  return {
    invitation: typeof invitation === 'string' ? invitation : null,
  };
};

export default useInvitation;
