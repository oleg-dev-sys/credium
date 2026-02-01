/** Product types */
export type ProductType = 'card' | 'loan' | 'microloan';

/** Credit product interface */
export interface Product {
  id: string;
  title: string;
  type: ProductType;
  apr: number;
  monthly: number;
  badge?: string;
  ai_score: number;
  bank?: string;
  features?: string[];
  requirements?: string[];
  max_amount?: number;
  min_amount?: number;
  term?: string;
  logo_url?: string; 
  tracking_url?: string;
}

/** AI Score summary */
export interface AIScoreSummary {
  score: number;
  explanation: string[];
  suggestions: string[];
}

/** Search parameters */
export interface SearchParams {
  amount: number;
  period: number;
  type?: ProductType;
  term?: number;
  creditScore?: number;
  income?: number;
  expenses: number;
  totalMonthlyPayments: number;
}

/** Search response */
export interface SearchResponse {
  results: Product[];
  aiSummary: AIScoreSummary;
}

/** Approval check response */
export interface ApprovalCheckResponse {
  chance: number;
  factors: Array<{
    name: string;
    weight: number;
  }>;
  suggestions: string[];
}

/** C-Unit mascot states */
export type CUnitState = 'idle' | 'scanning' | 'approve' | 'warn' | 'celebrate' | 'confused';

/** UI store state */
export interface UIState {
  isSearching: boolean;
  isMobileMenuOpen: boolean;
  setSearching: (searching: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}
