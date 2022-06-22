import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

export const Redirect: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/404');
  }, [router]);

  return null;
};
