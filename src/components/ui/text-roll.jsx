'use client';
import { motion } from 'framer-motion';

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.05,
  getExitDelay = (i) => i * 0.05 + 0.1,
  className,
}) {
  const letters = children.split('');

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <span
          key={i}
          className='relative inline-block [perspective:1000px] [transform-style:preserve-3d]'
          aria-hidden='true'
        >
          <motion.span
            className='absolute inline-block [backface-visibility:hidden] [transform-origin:50%_50%]'
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration, delay: getEnterDelay(i), ease: 'easeOut' }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
          <span className='invisible'>{letter === ' ' ? '\u00A0' : letter}</span>
        </span>
      ))}
    </span>
  );
}
