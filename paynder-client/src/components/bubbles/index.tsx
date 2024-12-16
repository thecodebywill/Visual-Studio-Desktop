import { useEffect, useRef } from "react";
import styles from "./bubbles.module.css";

const Bubbles = () => {
  const bubblesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (!bubblesRef.current) return;
      
    const bubblesContainer = bubblesRef.current;

    const createBubble = () => {
      const bubble = document.createElement("div");
      bubble.className = styles.bubble;

      // Random size
      const size = Math.random() * 60 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      // Random starting position
      bubble.style.left = `${Math.random() * 100}%`;

      // Random animation duration
      bubble.style.animationDuration = `${Math.random() * 15 + 5}s`;

      bubblesContainer?.appendChild(bubble);

      // Remove bubble after animation
      setTimeout(() => {
        bubble.remove();
      }, 10000);
    };

    const interval = setInterval(createBubble, Math.random() * 500);

    return () => clearInterval(interval);
  }, []);

  return <div ref={bubblesRef} className={styles.bubbles} />;
};

export default Bubbles;
