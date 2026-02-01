import { useMemo } from 'react';
import type { Variants } from 'framer-motion';
import type { CUnitState } from '@/components/types';

/**
 * Hook for C-Unit mascot animations
 * Respects prefers-reduced-motion
 */
export function useCUnitAnimations(prefersReducedMotion: boolean) {
  const bodyVariants: Variants = useMemo(
    () => ({
      idle: prefersReducedMotion
        ? {}
        : {
            scale: [1, 1.02, 1],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
      scanning: prefersReducedMotion
        ? {}
        : {
            scale: [1, 1.03, 1],
            transition: {
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
      approve: prefersReducedMotion
        ? {}
        : {
            scale: [1, 1.1, 1],
            y: [0, -8, 0],
            transition: {
              duration: 0.6,
              ease: 'easeOut',
            },
          },
      warn: prefersReducedMotion
        ? {}
        : {
            x: [-2, 2, -2, 2, 0],
            transition: {
              duration: 0.4,
              ease: 'easeInOut',
            },
          },
    }),
    [prefersReducedMotion]
  );

  const eyeVariants: Variants = useMemo(
    () => ({
      idle: prefersReducedMotion
        ? {}
        : {
            opacity: [1, 0.8, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
      scanning: prefersReducedMotion
        ? {}
        : {
            scaleX: [1, 0.3, 1],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              ease: 'linear',
            },
          },
      approve: {
        scaleY: 0.3,
        transition: { duration: 0.2 },
      },
      warn: {
        y: -2,
        transition: { duration: 0.2 },
      },
    }),
    [prefersReducedMotion]
  );

  const scanLineVariants: Variants = useMemo(
    () => ({
      idle: { opacity: 0 },
      scanning: prefersReducedMotion
        ? { opacity: 0.5 }
        : {
            opacity: [0.3, 0.8, 0.3],
            x: ['-100%', '100%'],
            transition: {
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
      approve: { opacity: 0 },
      warn: { opacity: 0 },
    }),
    [prefersReducedMotion]
  );

  const sparkleVariants: Variants = useMemo(
    () => ({
      idle: { opacity: 0, scale: 0 },
      scanning: { opacity: 0, scale: 0 },
      approve: prefersReducedMotion
        ? { opacity: 1, scale: 1 }
        : {
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            transition: {
              duration: 0.6,
              ease: 'easeOut',
            },
          },
      warn: { opacity: 0, scale: 0 },
    }),
    [prefersReducedMotion]
  );

  const glowVariants: Variants = useMemo(
    () => ({
      idle: { opacity: 0.2 },
      scanning: prefersReducedMotion
        ? { opacity: 0.4 }
        : {
            opacity: [0.2, 0.5, 0.2],
            transition: {
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
      approve: {
        opacity: 0.8,
        transition: { duration: 0.3 },
      },
      warn: {
        opacity: 0.6,
        transition: { duration: 0.2 },
      },
    }),
    [prefersReducedMotion]
  );

  return {
    bodyVariants,
    eyeVariants,
    scanLineVariants,
    sparkleVariants,
    glowVariants,
  };
}

/**
 * Get state color for C-Unit
 */
export function getCUnitColor(state: CUnitState): string {
  switch (state) {
    case 'scanning':
      return 'hsl(222, 100%, 61%)'; // tech-blue
    case 'approve':
      return 'hsl(164, 87%, 61%)'; // electric-mint
    case 'warn':
      return 'hsl(0, 84%, 60%)'; // destructive
    default:
      return 'hsl(222, 100%, 61%)'; // tech-blue
  }
}
