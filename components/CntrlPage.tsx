import type { NextPage } from 'next';
import { Page, PageProps, cntrlSdkContext } from '@cntrl-site/sdk-nextjs';

export const CntrlPage: NextPage<PageProps> = (props) => {
  cntrlSdkContext.init(props);
  return (
    <Page {...props} />
  );
};
