import { motion, useReducedMotion } from 'framer-motion';
import { useCUnitAnimations, getCUnitColor } from '@/hooks/useCUnitAnimations';
import type { CUnitState } from '@/components/types';

interface CUnitMascotProps {
  /** Current animation state */
  state?: CUnitState;
  /** Size in pixels */
  size?: number;
  /** Additional class names */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * C-Unit AI Mascot Component
 * Animated SVG character with multiple states
 */
export function CUnitMascot({
  state = 'idle',
  size = 80,
  className = '',
  onClick,
}: CUnitMascotProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const {
    bodyVariants,
    eyeVariants,
    scanLineVariants,
    sparkleVariants,
    glowVariants,
  } = useCUnitAnimations(prefersReducedMotion);

  const color = getCUnitColor(state);
  const isClickable = !!onClick;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`C-Unit AI помощник - ${getStateLabel(state)}`}
      onClick={onClick}
      whileHover={isClickable ? { scale: 1.05 } : undefined}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick?.();
              }
            }
          : undefined
      }
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: color }}
        variants={glowVariants}
        animate={state}
      />

      {/* Main SVG */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ width: size * 0.9, height: size * 0.9 }}
      >
        {/* Body */}
        <motion.g variants={bodyVariants} animate={state}>
          {/* Main body circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="currentColor"
            className="text-card"
            stroke={color}
            strokeWidth="3"
          />

          {/* Inner ring */}
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* C letter in center */}
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill={color}
            fontSize="28"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            C
          </text>

          {/* Eyes container */}
          <motion.g variants={eyeVariants} animate={state}>
            {/* Left eye */}
            <ellipse cx="35" cy="42" rx="5" ry="6" fill={color} />
            {/* Right eye */}
            <ellipse cx="65" cy="42" rx="5" ry="6" fill={color} />
          </motion.g>

          {/* Scan line (visible during scanning) */}
          <motion.rect
            x="18"
            y="48"
            width="64"
            height="4"
            rx="2"
            fill={color}
            variants={scanLineVariants}
            animate={state}
          />
        </motion.g>

        {/* Sparkles (visible on approve) */}
        <motion.g variants={sparkleVariants} animate={state}>
          <polygon
            points="15,20 17,24 21,24 18,27 19,31 15,28 11,31 12,27 9,24 13,24"
            fill="hsl(164, 87%, 61%)"
          />
          <polygon
            points="85,20 87,24 91,24 88,27 89,31 85,28 81,31 82,27 79,24 83,24"
            fill="hsl(164, 87%, 61%)"
          />
          <polygon
            points="50,5 52,9 56,9 53,12 54,16 50,13 46,16 47,12 44,9 48,9"
            fill="hsl(164, 87%, 61%)"
          />
        </motion.g>

        {/* Status indicator dot */}
        <circle
          cx="78"
          cy="78"
          r="8"
          fill={state === 'warn' ? 'hsl(0, 84%, 60%)' : state === 'approve' ? 'hsl(164, 87%, 61%)' : color}
        />
        <circle cx="78" cy="78" r="4" fill="white" />
      </svg>
    </motion.div>
  );
}

function getStateLabel(state: CUnitState): string {
  switch (state) {
    case 'scanning':
      return 'Анализирую';
    case 'approve':
      return 'Одобрено';
    case 'warn':
      return 'Внимание';
    default:
      return 'Готов помочь';
  }
}

export default CUnitMascot;
