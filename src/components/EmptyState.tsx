import { motion } from 'framer-motion';
import { Search, FileQuestion, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CUnitMascot } from './CUnitMascot';

interface EmptyStateProps {
  /** Type of empty state */
  type?: 'no-results' | 'error' | 'initial';
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Action button text */
  actionLabel?: string;
  /** Action handler */
  onAction?: () => void;
}

/**
 * Empty state component for various scenarios
 */
export function EmptyState({
  type = 'initial',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const getDefaultContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: <FileQuestion className="w-16 h-16 text-muted-foreground" />,
          title: 'Ничего не найдено',
          description: 'Попробуйте изменить параметры поиска или фильтры',
          actionLabel: 'Сбросить фильтры',
        };
      case 'error':
        return {
          icon: <RefreshCw className="w-16 h-16 text-destructive" />,
          title: 'Произошла ошибка',
          description: 'Не удалось загрузить данные. Попробуйте ещё раз',
          actionLabel: 'Повторить',
        };
      default:
        return {
          icon: <CUnitMascot state="idle" size={80} />,
          title: 'Начните поиск',
          description: 'Введите параметры, и мы подберём лучшие предложения',
          actionLabel: 'Быстрый подбор',
        };
    }
  };

  const content = getDefaultContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="mb-6">{content.icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title || content.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {description || content.description}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel || content.actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

export default EmptyState;
