import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface OnboardingStepperProps {
  /** Steps configuration */
  steps: Step[];
  /** Current step index */
  currentStep: number;
  /** Click handler */
  onStepClick?: (index: number) => void;
}

/**
 * Step indicator for onboarding flows
 */
export function OnboardingStepper({
  steps,
  currentStep,
  onStepClick,
}: OnboardingStepperProps) {
  return (
    <nav className="mb-8" aria-label="Прогресс">
      <ol className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.id} className="flex-1 relative">
              {/* Connector Line */}
              {index > 0 && (
                <div
                  className="absolute top-5 left-0 right-1/2 h-0.5 -translate-x-1/2"
                  style={{ width: 'calc(100% - 2.5rem)' }}
                >
                  <div
                    className={`h-full transition-colors ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                </div>
              )}

              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onStepClick?.(index)}
                  disabled={index > currentStep}
                  className="relative z-10 flex flex-col items-center group"
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                        ? 'bg-primary/10 border-2 border-primary text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    whileHover={index <= currentStep ? { scale: 1.05 } : undefined}
                    whileTap={index <= currentStep ? { scale: 0.95 } : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-medium">{index + 1}</span>
                    )}
                  </motion.div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default OnboardingStepper;
