import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import type { AIScoreSummary } from '@/components/types';

interface AIScoreCardProps {
  /** AI Score (0-100) */
  score: number;
  /** Explanation factors */
  explanation?: string[];
  /** Improvement suggestions */
  suggestions?: string[];
  /** Compact mode for result cards */
  compact?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * AI Score visualization card with circular progress
 */
export function AIScoreCard({
  score,
  explanation = [],
  suggestions = [],
  compact = false,
  className = '',
}: AIScoreCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score number
  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedScore(score);
      return;
    }

    const duration = 1200;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setAnimatedScore(current);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, prefersReducedMotion]);

  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-accent';
    if (s >= 50) return 'text-primary';
    return 'text-destructive';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 75) return 'Отлично';
    if (s >= 50) return 'Хорошо';
    return 'Средне';
  };

  // SVG circle calculations
  const radius = compact ? 28 : 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted"
            />
            {/* Progress circle */}
            <motion.circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className={getScoreColor(score)}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${getScoreColor(score)}`}>
              {animatedScore}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">AI Score</span>
          <span className={`text-sm font-medium ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl bg-card border border-border shadow-card ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Ваш AI Score</h3>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className={getScoreColor(score)}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {animatedScore}
            </span>
            <span className="text-xs text-muted-foreground">из 100</span>
          </div>
        </div>
      </div>

      {/* Score Label */}
      <div className="text-center mb-6">
        <span className={`text-lg font-semibold ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </span>
      </div>

      {/* Explanation */}
      {explanation.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Положительные факторы</span>
          </div>
          <ul className="space-y-1">
            {explanation.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Рекомендации</span>
          </div>
          <ul className="space-y-1">
            {suggestions.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default AIScoreCard;
