import styles from './app.module.css';

import { ReactComponent as Logo } from './logo.svg';

export function App() {
  return (
    <div className={styles.app}>
      <header className="flex">
        <Logo width="75" height="75" />
        <h1>Welcome to circleci-nx!</h1>
      </header>
      <main>
        <h2>I am circleci-nx</h2>
      </main>
    </div>
  );
}

export default App;
