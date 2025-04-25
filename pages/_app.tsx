import '../styles/reset.css';
import type { AppProps } from 'next/app';
import { CntrlProvider } from '@cntrl-site/sdk-nextjs';
import '@cntrl-site/sdk/style/sdk.css';
// place your custom items/sections definitions here
// customItems.define('custom-item', MyCustomItem);
// customSections.define('custom-section', {
//   component: MyCustomSection,
//   dataResolver: async () => ({ your: 'CMS data here' })
// });

function App({ Component, pageProps }: AppProps) {
  return (
    <CntrlProvider>
      <Component {...pageProps} />
    </CntrlProvider>
  );
}

export default App;
