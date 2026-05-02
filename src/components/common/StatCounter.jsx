import { useEffect, useRef, useState } from 'react';

const StatCounter = ({ end, duration = 2000, prefix = '', suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
        fontFamily: 'var(--font-heading)',
        background: 'var(--gradient-accent)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        lineHeight: 1.2
      }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      {label && <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>{label}</div>}
    </div>
  );
};

export default StatCounter;
