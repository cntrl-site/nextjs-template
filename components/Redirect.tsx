import { useRouter } from 'next/router';
import { FC } from 'react';

export const Redirect: FC = () => {
  const router = useRouter();
  router.push('/404');
  return null;
};
