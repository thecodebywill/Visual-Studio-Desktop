import styles from './footer.module.css'

const Footer: React.FC = () => {
  return (
    <footer  className={styles.footer}>
      <p>© {new Date().getFullYear()} Paynder. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
