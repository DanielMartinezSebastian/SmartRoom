'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay,
          ease: 'power3.out',
        }
      );
    }
  }, [delay]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}
