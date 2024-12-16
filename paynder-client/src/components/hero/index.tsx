import styles from "./hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>The ultimate stablecoin settlement solution</h1>
        <p>
          Leveraging the celo network to enable seamless stablecoin payments and
          transactions.
        </p>
        <a href="/invoice" className={styles.ctaButton}>
          Launch Beta
        </a>
      </div>
    </section>
  );
};

export default Hero;
