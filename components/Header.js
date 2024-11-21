import styles from '../styles/Home.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Lightning Websites Logo" />
        <span>Lightning Websites</span>
      </div>
      <nav className={styles.navLinks}>
        <a href="#">Products</a>
        <a href="#">Community</a>
        <a href="#">Resources</a>
        <a href="#">Contact</a>
      </nav>
      <div className={styles.authButtons}>
        <button className={styles.signIn}>Sign in</button>
        <button className={styles.register}>Register</button>
      </div>
    </header>
  );
}
  