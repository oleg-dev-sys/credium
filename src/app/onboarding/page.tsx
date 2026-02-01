import { Metadata } from 'next';
import OnboardingClient from '@/components/pages/Onboarding';

export const metadata: Metadata = {
  title: 'Подбор кредита: шаг за шагом | Credium',
  description: 'Заполните простую анкету, и наш AI подберет для вас идеальные кредитные предложения с высокой вероятностью одобрения.',
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}