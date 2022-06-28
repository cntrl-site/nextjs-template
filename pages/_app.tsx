import '../styles/reset.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App;
