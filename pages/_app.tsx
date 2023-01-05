import '../styles/reset.css';
import type { AppProps } from 'next/app';
import { CntrlProvider } from '@cntrl-site/sdk-nextjs';

// place for your custom items definitions
// cntrlSdkContext.customItems.define('customItem1', CustomItem1);

function App({ Component, pageProps }: AppProps) {
  return (
    <CntrlProvider>
      <Component {...pageProps} />
    </CntrlProvider>
  );
}

export default App;
