import { useEffect } from 'react';

const Bubbles = () => {
    useEffect(() => {
        const bubblesContainer = document.querySelector('.bubbles');
        
        const createBubble = () => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
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
            }, 20000);
        };
        
        // Create bubbles periodically
        const interval = setInterval(createBubble, 300);
        
        return () => clearInterval(interval);
    }, []);

    return <div className="bubbles" />;
};

export default Bubbles;
