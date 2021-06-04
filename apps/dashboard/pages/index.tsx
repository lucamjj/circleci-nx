import React from 'react';

import styles from './index.module.css';

export async function getServerSideProps(context) {
  return {
    props: {
      appName: 'dashboard',
    }, // will be passed to the page component as props
  };
}

export function Index({ appName }) {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className={styles.page}>
      <h2>I am {appName}</h2>
    </div>
  );
}

export default Index;
