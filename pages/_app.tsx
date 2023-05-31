import '../styles/reset.css';
import type { AppProps } from 'next/app';
import { CntrlProvider, cntrlSdkContext } from '@cntrl-site/sdk-nextjs';
import { MyComponent } from '../components/MyComponent';

// place for your custom items definitions
cntrlSdkContext.customItems.define('my-component', MyComponent);

function App({ Component, pageProps }: AppProps) {
  return (
    <CntrlProvider>
      <Component {...pageProps} />
    </CntrlProvider>
  );
}

export default App;
