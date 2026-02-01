'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CreditCard, Wallet, Banknote, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AppShell } from '@/components/AppShell';
import { OnboardingStepper } from '@/components/OnboardingStepper';
import { CUnitMascot } from '@/components/CUnitMascot';
import { formatCurrency } from '@/utils/formatCurrency';
import type { ProductType, CUnitState } from '@/components/types';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface ExistingLoan {
  id: string;
  name: string;
  monthlyPayment: number;
}

const steps = [
  { id: 'type', title: 'Тип продукта', description: 'Что вам нужно?' },
  { id: 'amount', title: 'Сумма', description: 'Сколько хотите?' },
  { id: 'purpose', title: 'Цель', description: 'На что потратите?' },
  { id: 'profile', title: 'Профиль', description: 'О вас' },
  { id: 'result', title: 'Готово', description: 'Ваш результат' },
];


export default function OnboardingClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [mascotState, setMascotState] = useState<CUnitState>('idle');

  const { user } = useAuth();

  const [productType, setProductType] = useState<ProductType>('loan');
  const [amount, setAmount] = useState(300000);
  const [income, setIncome] = useState(80000);
  const [expenses, setExpenses] = useState(40000);
  const [existingLoans, setExistingLoans] = useState<ExistingLoan[]>([]);
  const [purpose, setPurpose] = useState<string>('');
  const [otherPurpose, setOtherPurpose] = useState<string>('');

  const purposes = [
    { value: 'purchase', label: 'Покупка техники/мебели' },
    { value: 'renovation', label: 'Ремонт' },
    { value: 'car', label: 'Покупка автомобиля' },
    { value: 'vacation', label: 'Отпуск' },
    { value: 'education', label: 'Обучение' },
    { value: 'medical', label: 'Лечение' },
    { value: 'debt-consolidation', label: 'Рефинансирование' },
    { value: 'other', label: 'Другое' },
  ];

  useEffect(() => {
    if (!user) return;

    if (user.monthly_income != null) setIncome(user.monthly_income);
    if (user.monthly_expenses != null) setExpenses(user.monthly_expenses);

    if (user.total_monthly_payments && user.total_monthly_payments > 0) {
      setExistingLoans([
        {
          id: 'default-loan',
          name: 'Кредит',
          monthlyPayment: user.total_monthly_payments,
        },
      ]);
    }
  }, [user]);

  const addLoan = () => {
    setExistingLoans([...existingLoans, { id: crypto.randomUUID(), name: '', monthlyPayment: 0 }]);
  };

  const removeLoan = (id: string) => {
    setExistingLoans(existingLoans.filter(loan => loan.id !== id));
  };

  const updateLoan = (id: string, field: keyof Omit<ExistingLoan, 'id'>, value: string | number) => {
    setExistingLoans(existingLoans.map(loan => 
      loan.id === id ? { ...loan, [field]: value } : loan
    ));
  };

  const totalMonthlyPayments = existingLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  const productTypes = [
    { value: 'card', label: 'Кредитная карта', icon: <CreditCard className="w-6 h-6" />, desc: 'Для повседневных покупок' },
    { value: 'loan', label: 'Кредит наличными', icon: <Wallet className="w-6 h-6" />, desc: 'Крупные покупки, ремонт' },
    { value: 'microloan', label: 'Микрозайм', icon: <Banknote className="w-6 h-6" />, desc: 'Небольшая сумма, срочно' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setMascotState('scanning');
      setTimeout(() => setMascotState('idle'), 1000);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async() => {
    setMascotState('approve');
    const token = localStorage.getItem('access_token');

    const params = new URLSearchParams();
    params.set('amount', amount.toString());
    params.set('income', income.toString());
    params.set('expenses', expenses.toString());
    params.set('type', productType);

    try {
      if (user) {
        await api.updateProfile(token!, {
          monthly_income: income,
          monthly_expenses: expenses,
          total_monthly_payments: totalMonthlyPayments,
        });
      }
    } catch (err) {
      console.error("Failed to save profile", err);
      return;
    }

    setTimeout(() => {
        router.push(`/ai-results?${params.toString()}`);
    }, 800);
  };

  

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step-type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Что вы ищете?
              </h2>
              <p className="text-muted-foreground">
                Выберите тип продукта, который вам нужен
              </p>
            </div>

            <RadioGroup
              value={productType}
              onValueChange={(v) => setProductType(v as ProductType)}
              className="grid gap-4"
            >
              {productTypes.map((type) => (
                <Label
                  key={type.value}
                  htmlFor={type.value}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    productType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    productType === type.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.desc}</p>
                  </div>
                  {productType === type.value && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </Label>
              ))}
            </RadioGroup>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step-amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Какая сумма вам нужна?
              </h2>
              <p className="text-muted-foreground">
                Укажите желаемую сумму {productType === 'card' ? 'лимита' : 'кредита'}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <Label className="text-muted-foreground">Сумма</Label>
                <span className="font-bold text-xl text-primary">{formatCurrency(amount)}</span>
              </div>
              <Slider
                value={[amount]}
                onValueChange={([v]) => setAmount(v)}
                min={productType === 'microloan' ? 1000 : 10000}
                max={productType === 'microloan' ? 100000 : 5000000}
                step={productType === 'microloan' ? 1000 : 10000}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{formatCurrency(productType === 'microloan' ? 1000 : 10000)}</span>
                <span>{formatCurrency(productType === 'microloan' ? 100000 : 5000000)}</span>
              </div>
            </div>
          </motion.div>
        );

    case 2:
      return (
        <motion.div
          key="step-purpose"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              На что вы планируете потратить деньги?
            </h2>
            <p className="text-muted-foreground">
              Это поможет подобрать наиболее подходящие условия
            </p>
          </div>

          <div className="grid gap-3">
            {purposes.map((item) => (
              <Button
                key={item.value}
                variant={purpose === item.value ? 'default' : 'outline'}
                className="justify-start h-auto py-4 text-left"
                onClick={() => setPurpose(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Поле "Другое", если выбрано 'other' */}
          {purpose === 'other' && (
            <div className="mt-4">
              <Label htmlFor="other-purpose" className="text-muted-foreground">
                Уточните цель
              </Label>
              <Input
                id="other-purpose"
                placeholder="Например: свадьба, стартап и т.д."
                value={otherPurpose}
                onChange={(e) => setOtherPurpose(e.target.value)}
              />
            </div>
          )}
        </motion.div>
      );  

      case 3:
        return (
          <motion.div
            key="step-profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Немного о вас
              </h2>
              <p className="text-muted-foreground">
                Эти данные помогут точнее подобрать предложения
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <Label className="text-muted-foreground">Ежемесячный доход</Label>
                <span className="font-medium text-foreground">{formatCurrency(income)}</span>
              </div>
              <Slider
                value={[income]}
                onValueChange={([v]) => {
                  setIncome(v);
                  if (expenses > v) setExpenses(v);
                }}
                min={15000}
                max={500000}
                step={5000}
              />
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <Label className="text-muted-foreground">Средние месячные расходы</Label>
                <span className="font-medium text-foreground">{formatCurrency(expenses)}</span>
              </div>
              <Slider
                value={[expenses]}
                onValueChange={([v]) => setExpenses(v)}
                min={0}
                max={income}
                step={1000}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{formatCurrency(0)}</span>
                <span>{formatCurrency(income)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Текущие кредиты и займы</Label>
                {existingLoans.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Итого: {formatCurrency(totalMonthlyPayments)}/мес
                  </span>
                )}
              </div>

              {existingLoans.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Нет добавленных кредитов
                </p>
              ) : (
                <div className="space-y-3">
                  {existingLoans.map((loan, index) => (
                    <div key={loan.id} className="p-3 rounded-lg border border-border bg-muted/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Кредит {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeLoan(loan.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Название (например: Ипотека)"
                        value={loan.name}
                        onChange={(e) => updateLoan(loan.id, 'name', e.target.value)}
                      />
                      <div>
                        <Label className="text-xs text-muted-foreground">Ежемесячный платёж</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={loan.monthlyPayment || ''}
                          onChange={(e) => updateLoan(loan.id, 'monthlyPayment', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addLoan}
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить кредит
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6"
          >
            <CUnitMascot state={mascotState} size={100} className="mx-auto" />
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Отлично! Я всё понял
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Теперь я подберу лучшие предложения специально для вас
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border inline-block mx-auto">
              <div className="grid grid-cols-3 gap-6 text-left">
                <div>
                  <p className="text-xs text-muted-foreground">Тип</p>
                  <p className="font-medium text-foreground">
                    {productTypes.find(t => t.value === productType)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Сумма</p>
                  <p className="font-medium text-foreground">{formatCurrency(amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Доход</p>
                  <p className="font-medium text-foreground">{formatCurrency(income)}</p>
                </div>
                {existingLoans.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Платежи по кредитам</p>
                    <p className="font-medium text-foreground">{formatCurrency(totalMonthlyPayments)}/мес</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AppShell hideFooter>
      <div className="container max-w-2xl py-8">
        {/* Stepper */}
        <OnboardingStepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={(i) => i < currentStep && setCurrentStep(i)}
        />

        {/* Step Content */}
        <div className="min-h-[400px] py-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Далее
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-2">
              Найти предложения
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
