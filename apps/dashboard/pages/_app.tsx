import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Dashboard from '../components/templates/Dashboard';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to dashboard!</title>
      </Head>
      <div className="app">
        <main>
          <Dashboard>
            <Component {...pageProps} />
          </Dashboard>
        </main>
      </div>
    </>
  );
}

export default CustomApp;
