import '../styles/reset.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const style = document.getElementById('server-side-styles');

    if (style) {
      // TODO fix displaying JSS styles on the client and then safely uncomment removing of SSG styles
      // style.parentNode?.removeChild(style);
    }
  }, []);

  return <Component {...pageProps} />
}

export default App;
